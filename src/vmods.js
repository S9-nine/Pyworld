/* Practice versions of real Python modules, so later worlds can run real-looking code in the browser.
   json, os, requests, flask, pytest, sqlite3 and html behave like the real ones for everything the
   lessons use. open() reads and writes practice files kept in memory for each run. */

const CQ_PY = {};

CQ_PY.json = String.raw`
class JSONDecodeError(ValueError):
    pass

def _esc(s, ensure_ascii):
    out = '"'
    for ch in s:
        o = ord(ch)
        if ch == '"':
            out += '\\"'
        elif ch == '\\':
            out += '\\\\'
        elif ch == '\n':
            out += '\\n'
        elif ch == '\r':
            out += '\\r'
        elif ch == '\t':
            out += '\\t'
        elif o < 32 or (ensure_ascii and o > 126):
            out += '\\u' + ('0000' + hex(o)[2:])[-4:]
        else:
            out += ch
    return out + '"'

def _key(k):
    if isinstance(k, str):
        return k
    if k is True:
        return "true"
    if k is False:
        return "false"
    if k is None:
        return "null"
    if isinstance(k, (int, float)):
        return str(k)
    raise TypeError("keys must be str, int, float, bool or None, not " + type(k).__name__)

def _dump(o, indent, sort_keys, level, ea, seps):
    if o is None:
        return "null"
    if o is True:
        return "true"
    if o is False:
        return "false"
    if isinstance(o, int):
        return str(o)
    if isinstance(o, float):
        if o != o:
            return "NaN"
        if o == float("inf"):
            return "Infinity"
        if o == float("-inf"):
            return "-Infinity"
        return repr(o)
    if isinstance(o, str):
        return _esc(o, ea)
    if isinstance(o, (list, tuple)):
        if len(o) == 0:
            return "[]"
        items = [_dump(v, indent, sort_keys, level + 1, ea, seps) for v in o]
        return _wrap("[", "]", items, indent, level, seps)
    if isinstance(o, dict):
        if len(o) == 0:
            return "{}"
        keys = list(o.keys())
        if sort_keys:
            keys = sorted(keys)
        items = [_esc(_key(k), ea) + seps[1] + _dump(o[k], indent, sort_keys, level + 1, ea, seps) for k in keys]
        return _wrap("{", "}", items, indent, level, seps)
    raise TypeError("Object of type " + type(o).__name__ + " is not JSON serializable")

def _wrap(a, b, items, indent, level, seps):
    if indent is None:
        return a + seps[0].join(items) + b
    pad = " " * indent if isinstance(indent, int) else indent
    inner = "\n" + pad * (level + 1)
    return a + inner + (seps[0] + inner).join(items) + "\n" + pad * level + b

def dumps(obj, indent=None, sort_keys=False, ensure_ascii=True, separators=None, default=None):
    if separators is None:
        separators = (", ", ": ") if indent is None else (",", ": ")
    return _dump(obj, indent, sort_keys, 0, ensure_ascii, separators)

def dump(obj, fp, **kw):
    fp.write(dumps(obj, **kw))

class _P:
    def __init__(self, s):
        self.s = s
        self.i = 0
        self.n = len(s)

    def fail(self, msg):
        line = 1
        col = 1
        for k in range(self.i):
            if self.s[k] == "\n":
                line += 1
                col = 1
            else:
                col += 1
        raise JSONDecodeError(msg + ": line " + str(line) + " column " + str(col) + " (char " + str(self.i) + ")")

    def peek(self):
        return self.s[self.i] if self.i < self.n else ""

    def ws(self):
        while self.i < self.n and self.s[self.i] in " \t\n\r":
            self.i += 1

    def value(self):
        self.ws()
        c = self.peek()
        if c == "{":
            return self.obj()
        if c == "[":
            return self.arr()
        if c == '"':
            return self.string()
        for word, val in (("true", True), ("false", False), ("null", None)):
            if self.s[self.i:self.i + len(word)] == word:
                self.i += len(word)
                return val
        if c == "-" or c.isdigit():
            return self.num()
        self.fail("Expecting value")

    def obj(self):
        self.i += 1
        d = {}
        self.ws()
        if self.peek() == "}":
            self.i += 1
            return d
        while True:
            self.ws()
            if self.peek() != '"':
                self.fail("Expecting property name enclosed in double quotes")
            k = self.string()
            self.ws()
            if self.peek() != ":":
                self.fail("Expecting ':' delimiter")
            self.i += 1
            d[k] = self.value()
            self.ws()
            c = self.peek()
            if c == ",":
                self.i += 1
                continue
            if c == "}":
                self.i += 1
                return d
            self.fail("Expecting ',' delimiter")

    def arr(self):
        self.i += 1
        a = []
        self.ws()
        if self.peek() == "]":
            self.i += 1
            return a
        while True:
            a.append(self.value())
            self.ws()
            c = self.peek()
            if c == ",":
                self.i += 1
                continue
            if c == "]":
                self.i += 1
                return a
            self.fail("Expecting ',' delimiter")

    def string(self):
        start = self.i
        self.i += 1
        out = []
        esc = {'"': '"', '\\': '\\', '/': '/', 'b': '\b', 'f': '\f', 'n': '\n', 'r': '\r', 't': '\t'}
        while True:
            if self.i >= self.n:
                self.i = start
                self.fail("Unterminated string starting at")
            c = self.s[self.i]
            if c == '"':
                self.i += 1
                return "".join(out)
            if c == "\\":
                e = self.s[self.i + 1] if self.i + 1 < self.n else ""
                if e == "u":
                    out.append(chr(int(self.s[self.i + 2:self.i + 6], 16)))
                    self.i += 6
                    continue
                if e not in esc:
                    self.fail("Invalid \\escape")
                out.append(esc[e])
                self.i += 2
                continue
            if c == "\n":
                self.fail("Invalid control character at")
            out.append(c)
            self.i += 1

    def num(self):
        j = self.i
        if self.s[j] == "-":
            j += 1
        while j < self.n and self.s[j] in "0123456789.eE+-":
            j += 1
        t = self.s[self.i:j]
        self.i = j
        try:
            if "." in t or "e" in t or "E" in t:
                return float(t)
            return int(t)
        except ValueError:
            self.fail("Expecting value")

def loads(s):
    if not isinstance(s, str):
        raise TypeError("the JSON object must be str, not " + type(s).__name__)
    p = _P(s)
    v = p.value()
    p.ws()
    if p.i != p.n:
        p.fail("Extra data")
    return v

def load(fp):
    return loads(fp.read())
`;

CQ_PY._cq_io = String.raw`
import _cqfs

class OSError(Exception):
    pass

class FileNotFoundError(OSError):
    pass

class FileExistsError(OSError):
    pass

class IsADirectoryError(OSError):
    pass

class UnsupportedOperation(OSError):
    pass

class _File:
    def __init__(self, name, mode):
        self.name = name
        self.mode = mode
        self.closed = False
        self._pos = 0
        if "r" in mode:
            if _cqfs.read(name) is None:
                raise FileNotFoundError("[Errno 2] No such file or directory: " + repr(name))
        elif "w" in mode:
            _cqfs.write(name, "")
        elif "a" in mode:
            if _cqfs.read(name) is None:
                _cqfs.write(name, "")
        elif "x" in mode:
            if _cqfs.read(name) is not None:
                raise FileExistsError("[Errno 17] File exists: " + repr(name))
            _cqfs.write(name, "")
        else:
            raise ValueError("invalid mode: " + repr(mode))

    def _check(self, want):
        if self.closed:
            raise ValueError("I/O operation on closed file.")
        if want == "r" and "r" not in self.mode and "+" not in self.mode:
            raise UnsupportedOperation("not readable")
        if want == "w" and "r" in self.mode and "+" not in self.mode:
            raise UnsupportedOperation("not writable")

    def read(self, size=-1):
        self._check("r")
        data = _cqfs.read(self.name) or ""
        end = len(data) if size is None or size < 0 else min(len(data), self._pos + size)
        chunk = data[self._pos:end]
        self._pos = end
        return chunk

    def readline(self):
        self._check("r")
        data = _cqfs.read(self.name) or ""
        i = data.find("\n", self._pos)
        end = len(data) if i < 0 else i + 1
        line = data[self._pos:end]
        self._pos = end
        return line

    def readlines(self):
        lines = []
        while True:
            line = self.readline()
            if not line:
                return lines
            lines.append(line)

    def __iter__(self):
        return self

    def __next__(self):
        line = self.readline()
        if not line:
            raise StopIteration
        return line

    def write(self, s):
        self._check("w")
        if not isinstance(s, str):
            raise TypeError("write() argument must be str, not " + type(s).__name__)
        _cqfs.append(self.name, s)
        return len(s)

    def writelines(self, lines):
        for line in lines:
            self.write(line)

    def close(self):
        self.closed = True

    def __enter__(self):
        return self

    def __exit__(self, a, b, c):
        self.close()
        return False

    def __repr__(self):
        return "<_io.TextIOWrapper name=" + repr(self.name) + " mode=" + repr(self.mode) + " encoding='UTF-8'>"

def open(file, mode="r", encoding=None, newline=None, errors=None, buffering=-1):
    if "b" in mode:
        raise ValueError("Binary files aren't available in Code Quest's practice files. Use text mode.")
    return _File(str(file), mode)
`;

CQ_PY.os = String.raw`
import _cqfs
import _cqenv

class _Environ(dict):
    def __repr__(self):
        return "environ(" + dict.__repr__(self) + ")"

environ = _Environ(_cqenv.get())
sep = "/"
name = "posix"

def getenv(key, default=None):
    return environ.get(key, default)

def listdir(path="."):
    return _cqfs.names()

def remove(path):
    if _cqfs.read(path) is None:
        raise FileNotFoundError("[Errno 2] No such file or directory: " + repr(path))
    _cqfs.remove(path)

def getcwd():
    return "/home/hero/quest"

class path:
    sep = "/"

    @staticmethod
    def exists(p):
        return _cqfs.read(str(p)) is not None

    @staticmethod
    def isfile(p):
        return _cqfs.read(str(p)) is not None

    @staticmethod
    def join(*parts):
        out = ""
        for part in parts:
            if part.startswith("/") or out == "":
                out = part
            elif out.endswith("/"):
                out += part
            else:
                out += "/" + part
        return out

    @staticmethod
    def basename(p):
        return p.split("/")[-1]

    @staticmethod
    def splitext(p):
        i = p.rfind(".")
        if i <= p.rfind("/") + 1:
            return (p, "")
        return (p[:i], p[i:])
`;

CQ_PY.html = String.raw`
def escape(s, quote=True):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if quote:
        s = s.replace('"', "&quot;").replace("'", "&#x27;")
    return s
`;

CQ_PY.requests = String.raw`
import json as _json
import _cqnet

class RequestException(Exception):
    pass

class ConnectionError(RequestException):
    pass

class HTTPError(RequestException):
    pass

class Timeout(RequestException):
    pass

class InvalidJSONError(RequestException):
    pass

# Like real requests: catchable as requests's own error or as json's.
class JSONDecodeError(InvalidJSONError, _json.JSONDecodeError):
    pass

class exceptions:
    RequestException = RequestException
    ConnectionError = ConnectionError
    HTTPError = HTTPError
    Timeout = Timeout
    JSONDecodeError = JSONDecodeError
    InvalidJSONError = InvalidJSONError

_REASONS = {200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized",
            403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 429: "Too Many Requests",
            500: "Internal Server Error", 503: "Service Unavailable"}

class Response:
    def __init__(self, url, status, text, headers):
        self.url = url
        self.status_code = status
        self.text = text
        self.headers = headers
        self.ok = status < 400
        self.reason = _REASONS.get(status, "")

    def json(self):
        try:
            return _json.loads(self.text)
        except _json.JSONDecodeError as e:
            raise JSONDecodeError(str(e))

    def raise_for_status(self):
        if self.status_code >= 400:
            kind = "Client" if self.status_code < 500 else "Server"
            raise HTTPError(str(self.status_code) + " " + kind + " Error: " + self.reason + " for url: " + self.url)

    def __repr__(self):
        return "<Response [" + str(self.status_code) + "]>"

def request(method, url, params=None, json=None, data=None, headers=None, timeout=None):
    body = _json.dumps(json) if json is not None else None
    r = _cqnet.fetch(method.upper(), url, params or {}, body, data or {})
    if r["error"]:
        raise ConnectionError(r["error"])
    return Response(r["url"], r["status"], r["text"], r["headers"])

def get(url, params=None, **kw):
    return request("GET", url, params=params, **kw)

def post(url, data=None, json=None, **kw):
    return request("POST", url, data=data, json=json, **kw)

def put(url, data=None, json=None, **kw):
    return request("PUT", url, data=data, json=json, **kw)

def delete(url, **kw):
    return request("DELETE", url, **kw)
`;

CQ_PY.flask = String.raw`
import json as _json

_REASONS = {200: "OK", 201: "CREATED", 204: "NO CONTENT", 301: "MOVED PERMANENTLY", 302: "FOUND",
            400: "BAD REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT FOUND",
            405: "METHOD NOT ALLOWED", 409: "CONFLICT", 415: "UNSUPPORTED MEDIA TYPE",
            422: "UNPROCESSABLE ENTITY", 500: "INTERNAL SERVER ERROR"}

class HTTPException(Exception):
    def __init__(self, code, description=""):
        Exception.__init__(self, str(code) + " " + _REASONS.get(code, ""))
        self.code = code
        self.description = description

class _Args(dict):
    def get(self, key, default=None, type=None):
        if key not in self:
            return default
        v = dict.get(self, key)
        if type is not None:
            try:
                return type(v)
            except (ValueError, TypeError):
                return default
        return v

def _unquote(s):
    s = s.replace("+", " ")
    out = ""
    i = 0
    while i < len(s):
        if s[i] == "%" and i + 2 < len(s):
            try:
                out += chr(int(s[i + 1:i + 3], 16))
                i += 3
                continue
            except ValueError:
                pass
        out += s[i]
        i += 1
    return out

def _parse_qs(qs):
    out = {}
    for part in qs.split("&"):
        if not part:
            continue
        if "=" in part:
            k, v = part.split("=", 1)
        else:
            k, v = part, ""
        out[_unquote(k)] = _unquote(v)
    return out

class _Request:
    def __init__(self):
        self._set("GET", "/", {}, {}, None, {})

    def _set(self, method, path, args, form, body, headers):
        self.method = method
        self.path = path
        self.args = _Args(args)
        self.form = _Args(form)
        self.headers = headers
        self._body = body
        self.is_json = body is not None

    def get_json(self, silent=False, force=False):
        if self._body is None:
            if silent:
                return None
            raise HTTPException(415, "Did not attempt to load JSON data because the request Content-Type was not 'application/json'.")
        try:
            return _json.loads(self._body)
        except ValueError:
            if silent:
                return None
            raise HTTPException(400, "Failed to decode JSON object.")

    @property
    def json(self):
        return self.get_json()

request = _Request()

class Response:
    def __init__(self, response="", status=200, mimetype="text/html", headers=None):
        self._text = response
        self.status_code = status
        self.mimetype = mimetype
        self.headers = dict(headers or {})
        self.headers["Content-Type"] = mimetype + ("; charset=utf-8" if mimetype.startswith("text") else "")
        self.error = None

    @property
    def status(self):
        return str(self.status_code) + " " + _REASONS.get(self.status_code, "")

    def get_data(self, as_text=False):
        return self._text

    @property
    def text(self):
        return self._text

    @property
    def data(self):
        return self._text

    @property
    def is_json(self):
        return self.mimetype == "application/json"

    def get_json(self, silent=False):
        try:
            return _json.loads(self._text)
        except ValueError:
            return None

    @property
    def json(self):
        return self.get_json()

    def __repr__(self):
        return "<Response " + str(len(self._text)) + " bytes [" + self.status + "]>"

def jsonify(*args, **kwargs):
    if args and kwargs:
        raise TypeError("jsonify() behavior undefined when passed both args and kwargs")
    if len(args) == 1:
        data = args[0]
    elif args:
        data = list(args)
    else:
        data = kwargs
    return Response(_json.dumps(data, sort_keys=True) + "\n", 200, "application/json")

def abort(code, description=None):
    raise HTTPException(code, description or "")

def redirect(location, code=302):
    r = Response("Redirecting to " + location, code)
    r.headers["Location"] = location
    return r

def make_response(body="", status=200):
    if isinstance(body, Response):
        body.status_code = status
        return body
    if isinstance(body, (dict, list)):
        r = jsonify(body)
        r.status_code = status
        return r
    return Response(body, status)

class _Rule:
    def __init__(self, rule, methods, func):
        self.rule = rule
        self.methods = methods
        self.func = func

    def match(self, path):
        a = self.rule.split("/")
        b = path.split("/")
        if len(a) != len(b):
            return None
        kw = {}
        for x, y in zip(a, b):
            if x.startswith("<") and x.endswith(">"):
                inner = x[1:-1]
                conv, name = inner.split(":", 1) if ":" in inner else ("string", inner)
                if y == "":
                    return None
                if conv == "int":
                    if not y.isdigit():
                        return None
                    kw[name] = int(y)
                elif conv == "float":
                    try:
                        kw[name] = float(y)
                    except ValueError:
                        return None
                else:
                    kw[name] = _unquote(y)
            elif x != y:
                return None
        return kw

class Flask:
    def __init__(self, import_name, **kw):
        self.name = import_name
        self._rules = []
        self._handlers = {}
        self.config = {"DEBUG": False, "TESTING": False}
        self.debug = False
        self.testing = False
        self.secret_key = None

    def route(self, rule, methods=None, **kw):
        def deco(f):
            m = [x.upper() for x in (methods or ["GET"])]
            self._rules.append(_Rule(rule, m, f))
            return f
        return deco

    def get(self, rule, **kw):
        return self.route(rule, methods=["GET"])

    def post(self, rule, **kw):
        return self.route(rule, methods=["POST"])

    def put(self, rule, **kw):
        return self.route(rule, methods=["PUT"])

    def delete(self, rule, **kw):
        return self.route(rule, methods=["DELETE"])

    def errorhandler(self, code):
        def deco(f):
            self._handlers[code] = f
            return f
        return deco

    def run(self, host="127.0.0.1", port=5000, debug=False, **kw):
        print(" * Serving Flask app '" + str(self.name) + "'")
        print(" * Running on http://" + host + ":" + str(port))
        print("(Practice mode: Code Quest can't open a real server. Use app.test_client() to send requests.)")

    def test_client(self):
        return _Client(self)

    def _make(self, rv):
        status = 200
        headers = None
        if isinstance(rv, tuple):
            if len(rv) == 3:
                rv, status, headers = rv
            elif len(rv) == 2:
                if isinstance(rv[1], dict):
                    rv, headers = rv
                else:
                    rv, status = rv
        if isinstance(rv, Response):
            r = rv
            if status != 200:
                r.status_code = status
        elif rv is None:
            raise TypeError("The view function did not return a valid response. The function either returned None or ended without a return statement.")
        elif isinstance(rv, (dict, list)):
            r = jsonify(rv)
            r.status_code = status
        elif isinstance(rv, str):
            r = Response(rv, status, "text/html")
        else:
            raise TypeError("The view function did not return a valid response. The return type must be a string, dict, list, tuple with headers or status, Response instance, or WSGI callable, but it was a " + type(rv).__name__ + ".")
        if headers:
            for k in headers:
                r.headers[k] = headers[k]
        return r

    def _error(self, code, desc, err=None):
        if code in self._handlers:
            r = self._make(self._handlers[code](HTTPException(code, desc)))
            if code != 200 and r.status_code == 200:
                r.status_code = code
        else:
            title = str(code) + " " + _REASONS.get(code, "").title()
            r = Response("<!doctype html>\n<title>" + title + "</title>\n<h1>" + _REASONS.get(code, "").title() + "</h1>\n<p>" + desc + "</p>\n", code)
        r.error = err
        return r

    def _dispatch(self, method, path, args, form, body, headers):
        request._set(method, path, args, form, body, headers)
        allowed = []
        for rule in self._rules:
            kw = rule.match(path)
            if kw is None:
                continue
            if method not in rule.methods:
                allowed.extend(rule.methods)
                continue
            try:
                return self._make(rule.func(**kw))
            except HTTPException as e:
                return self._error(e.code, e.description)
            except Exception as e:
                msg = type(e).__name__ + ": " + str(e)
                print("[server error] Exception on " + path + " [" + method + "] " + msg)
                return self._error(500, "The server encountered an internal error and was unable to complete your request.", msg)
        if allowed:
            return self._error(405, "The method is not allowed for the requested URL.")
        return self._error(404, "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.")

class _Client:
    def __init__(self, app):
        self.app = app

    def open(self, path, method="GET", query_string=None, json=None, data=None, headers=None):
        args = {}
        if "?" in path:
            path, qs = path.split("?", 1)
            args = _parse_qs(qs)
        if query_string:
            for k in query_string:
                args[k] = str(query_string[k])
        body = _json.dumps(json) if json is not None else None
        form = {}
        if isinstance(data, dict):
            for k in data:
                form[k] = str(data[k])
        return self.app._dispatch(method.upper(), path, args, form, body, headers or {})

    def get(self, path, **kw):
        return self.open(path, "GET", **kw)

    def post(self, path, **kw):
        return self.open(path, "POST", **kw)

    def put(self, path, **kw):
        return self.open(path, "PUT", **kw)

    def delete(self, path, **kw):
        return self.open(path, "DELETE", **kw)
`;

CQ_PY.pytest = String.raw`
class _Raises:
    def __init__(self, exc, match):
        self.exc = exc
        self.match = match
        self.value = None

    def __enter__(self):
        return self

    def __exit__(self, et, ev, tb):
        if et is None:
            raise AssertionError("DID NOT RAISE " + self.exc.__name__)
        if not issubclass(et, self.exc):
            return False
        if self.match is not None and self.match not in str(ev):
            raise AssertionError("Raised " + et.__name__ + " but the message " + repr(str(ev)) + " does not contain " + repr(self.match))
        self.value = ev
        return True

def raises(exc, match=None):
    return _Raises(exc, match)

class approx:
    def __init__(self, expected, rel=1e-6, abs=1e-12):
        self.expected = expected
        self.rel = rel
        self.abs = abs

    def _close(self, a, b):
        tol = max(self.rel * (b if b > 0 else -b), self.abs)
        d = a - b
        return (d if d > 0 else -d) <= tol

    def __eq__(self, other):
        if isinstance(self.expected, (list, tuple)):
            if len(other) != len(self.expected):
                return False
            for a, b in zip(other, self.expected):
                if not self._close(a, b):
                    return False
            return True
        return self._close(other, self.expected)

    def __repr__(self):
        return "approx(" + repr(self.expected) + ")"

class _Mark:
    def parametrize(self, names, values):
        def deco(f):
            ns = [n.strip() for n in names.split(",")] if isinstance(names, str) else list(names)
            f._cq_params = (ns, list(values))
            return f
        return deco

mark = _Mark()

def fail(msg=""):
    raise AssertionError(msg)
`;

CQ_PY.sqlite3 = String.raw`
import _cqsql

class Error(Exception):
    pass

class DatabaseError(Error):
    pass

class OperationalError(DatabaseError):
    pass

class IntegrityError(DatabaseError):
    pass

class ProgrammingError(DatabaseError):
    pass

_KINDS = {"op": OperationalError, "int": IntegrityError, "prog": ProgrammingError}

class Row:
    def __init__(self, cursor, values):
        self._cols = [d[0] for d in cursor.description]
        self._vals = tuple(values)

    def keys(self):
        return list(self._cols)

    def __getitem__(self, k):
        if isinstance(k, str):
            for i, c in enumerate(self._cols):
                if c.lower() == k.lower():
                    return self._vals[i]
            raise IndexError("No item with that key")
        return self._vals[k]

    def __len__(self):
        return len(self._vals)

    def __iter__(self):
        return iter(self._vals)

    def __eq__(self, other):
        return isinstance(other, Row) and self._vals == other._vals

    def __repr__(self):
        return "<sqlite3.Row object>"

class Cursor:
    def __init__(self, conn):
        self.connection = conn
        self.description = None
        self.rowcount = -1
        self.lastrowid = None
        self.arraysize = 1
        self._rows = []
        self._i = 0

    def execute(self, sql, parameters=()):
        c = self.connection
        c._check()
        head = sql.lstrip().upper()
        if head.startswith("INSERT") or head.startswith("UPDATE") or head.startswith("DELETE") or head.startswith("REPLACE"):
            if not c.in_transaction:
                _cqsql.run(c._name, "BEGIN", [])
                c.in_transaction = True
        params = dict(parameters) if isinstance(parameters, dict) else list(parameters)
        r = _cqsql.run(c._name, sql, params)
        if r["error"]:
            raise _KINDS[r["kind"]](r["error"])
        cols = r["columns"]
        self.description = tuple([(n, None, None, None, None, None, None) for n in cols]) if cols else None
        rows = [tuple(x) for x in r["rows"]]
        if c.row_factory is not None and cols:
            rows = [c.row_factory(self, t) for t in rows]
        self._rows = rows
        self._i = 0
        self.rowcount = -1 if cols else r["changes"]
        if head.startswith("INSERT") or head.startswith("REPLACE"):
            self.lastrowid = r["lastrowid"]
        if head.startswith("BEGIN"):
            c.in_transaction = True
        if head.startswith("COMMIT") or head.startswith("END") or head.startswith("ROLLBACK"):
            c.in_transaction = False
        return self

    def executemany(self, sql, seq):
        total = 0
        for p in seq:
            self.execute(sql, p)
            total += self.rowcount
        self.rowcount = total
        return self

    def executescript(self, script):
        c = self.connection
        c._check()
        if c.in_transaction:
            c.commit()
        r = _cqsql.script(c._name, script)
        if r["error"]:
            raise _KINDS[r["kind"]](r["error"])
        return self

    def fetchone(self):
        if self._i >= len(self._rows):
            return None
        row = self._rows[self._i]
        self._i += 1
        return row

    def fetchmany(self, size=None):
        n = self.arraysize if size is None else size
        out = self._rows[self._i:self._i + n]
        self._i += len(out)
        return out

    def fetchall(self):
        out = self._rows[self._i:]
        self._i = len(self._rows)
        return out

    def __iter__(self):
        return iter(self.fetchall())

    def close(self):
        pass

# Open connections. All connections to one practice database share a single copy, so a new
# connection must not see another's uncommitted changes: opening it discards them, the way a
# forgotten commit() loses work in real programs.
_LIVE = []

class Connection:
    def __init__(self, name):
        self._name = _cqsql.open(name)
        for other in _LIVE:
            if other._name == self._name and other.in_transaction and not other._closed:
                _cqsql.run(other._name, "ROLLBACK", [])
                other.in_transaction = False
        _LIVE.append(self)
        self.row_factory = None
        self.in_transaction = False
        self._closed = False

    def _check(self):
        if self._closed:
            raise ProgrammingError("Cannot operate on a closed database.")

    def cursor(self):
        self._check()
        return Cursor(self)

    def execute(self, sql, parameters=()):
        return self.cursor().execute(sql, parameters)

    def executemany(self, sql, seq):
        return self.cursor().executemany(sql, seq)

    def executescript(self, script):
        return self.cursor().executescript(script)

    def commit(self):
        self._check()
        if self.in_transaction:
            _cqsql.run(self._name, "COMMIT", [])
            self.in_transaction = False

    def rollback(self):
        self._check()
        if self.in_transaction:
            _cqsql.run(self._name, "ROLLBACK", [])
            self.in_transaction = False

    def close(self):
        if not self._closed and self.in_transaction:
            _cqsql.run(self._name, "ROLLBACK", [])
            self.in_transaction = False
        self._closed = True

    def __enter__(self):
        return self

    def __exit__(self, et, ev, tb):
        if et is None:
            self.commit()
        else:
            self.rollback()
        return False

def connect(database, **kw):
    return Connection(str(database))
`;

/* JavaScript halves of the practice modules. Each becomes a Skulpt module via toString(). */
const CQ_JS = {
  _cqfs: function (name) {
    const R = globalThis.CQRT, js = (v) => Sk.ffi.remapToJs(v), none = Sk.builtin.none.none$, mod = {};
    mod.read = new Sk.builtin.func((n) => { const v = R.fs[js(n)]; return v === undefined ? none : new Sk.builtin.str(v); });
    mod.write = new Sk.builtin.func((n, s) => { R.fs[js(n)] = js(s); return none; });
    mod.append = new Sk.builtin.func((n, s) => { const k = js(n); R.fs[k] = (R.fs[k] || "") + js(s); return none; });
    mod.remove = new Sk.builtin.func((n) => { delete R.fs[js(n)]; return none; });
    mod.names = new Sk.builtin.func(() => new Sk.builtin.list(Object.keys(R.fs).sort().map((k) => new Sk.builtin.str(k))));
    return mod;
  },
  _cqenv: function (name) {
    const R = globalThis.CQRT, mod = {};
    mod.get = new Sk.builtin.func(() => Sk.ffi.remapToPy(Object.assign({}, R.env || {})));
    return mod;
  },
  _cqnet: function (name) {
    const R = globalThis.CQRT, js = (v) => Sk.ffi.remapToJs(v), mod = {};
    mod.fetch = new Sk.builtin.func((m, u, p, b, d) => {
      const res = cqFetch(js(m), js(u), js(p) || {}, js(b), js(d) || {}, R.api);
      return Sk.ffi.remapToPy({ url: res.url || js(u), status: res.status || 0, text: res.text || "", headers: res.headers || {}, error: res.error || null });
    });
    return mod;
  },
  _cqsql: function (name) {
    const R = globalThis.CQRT, js = (v) => Sk.ffi.remapToJs(v), none = Sk.builtin.none.none$, mod = {};
    const toPy = (v, t) => v === null || v === undefined ? none : t === 2 ? new Sk.builtin.float_(v) : typeof v === "number" ? (Number.isInteger(v) ? new Sk.builtin.int_(v) : new Sk.builtin.float_(v)) : new Sk.builtin.str(String(v));
    const result = (o) => {
      const d = new Sk.builtin.dict([]);
      const set = (k, v) => d.mp$ass_subscript(new Sk.builtin.str(k), v);
      set("error", o.error ? new Sk.builtin.str(o.error) : none);
      set("kind", new Sk.builtin.str(o.kind || "op"));
      set("columns", o.columns ? new Sk.builtin.list(o.columns.map((c) => new Sk.builtin.str(c))) : none);
      set("rows", new Sk.builtin.list((o.rows || []).map((r, ri) => new Sk.builtin.list(r.map((v, ci) => toPy(v, o.rowTypes ? o.rowTypes[ri][ci] : 0))))));
      set("changes", new Sk.builtin.int_(o.changes || 0));
      set("lastrowid", o.lastrowid == null ? none : new Sk.builtin.int_(o.lastrowid));
      return d;
    };
    mod.open = new Sk.builtin.func((n) => new Sk.builtin.str(cqSqlOpen(js(n))));
    mod.run = new Sk.builtin.func((n, sql, params) => result(cqSqlRun(js(n), js(sql), js(params))));
    mod.script = new Sk.builtin.func((n, sql) => result(cqSqlScript(js(n), js(sql))));
    return mod;
  }
};

/* ── Practice internet for requests ── */
const CQ_POKEMON = {
  pikachu: [25, 4, 60, 112, ["electric"], [35, 55, 40, 50, 50, 90], ["static", "lightning-rod"]],
  bulbasaur: [1, 7, 69, 64, ["grass", "poison"], [45, 49, 49, 65, 65, 45], ["overgrow", "chlorophyll"]],
  charmander: [4, 6, 85, 62, ["fire"], [39, 52, 43, 60, 50, 65], ["blaze", "solar-power"]],
  squirtle: [7, 5, 90, 63, ["water"], [44, 48, 65, 50, 64, 43], ["torrent", "rain-dish"]],
  gengar: [94, 15, 405, 250, ["ghost", "poison"], [60, 65, 60, 130, 75, 110], ["cursed-body"]],
  eevee: [133, 3, 65, 65, ["normal"], [55, 55, 50, 45, 65, 55], ["run-away", "adaptability", "anticipation"]],
  snorlax: [143, 21, 4600, 189, ["normal"], [160, 110, 65, 65, 110, 30], ["immunity", "thick-fat", "gluttony"]]
};
function cqPokemon(key) {
  const name = Object.keys(CQ_POKEMON).find((n) => n === key || String(CQ_POKEMON[n][0]) === key);
  if (!name) return null;
  const [id, height, weight, xp, types, st, ab] = CQ_POKEMON[name];
  const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
  return {
    id, name, height, weight, base_experience: xp,
    types: types.map((t, i) => ({ slot: i + 1, type: { name: t, url: "https://pokeapi.co/api/v2/type/" + t + "/" } })),
    abilities: ab.map((a, i) => ({ ability: { name: a }, is_hidden: i === ab.length - 1 && ab.length > 1, slot: i + 1 })),
    stats: st.map((v, i) => ({ base_stat: v, effort: 0, stat: { name: statNames[i] } }))
  };
}
const CQ_API_DEFAULT = [
  { url: /^https:\/\/pokeapi\.co\/api\/v2\/pokemon\/([^/?]+)\/?$/, fn: (m) => { const p = cqPokemon(m[1]); return p ? { json: p } : { status: 404, text: "Not Found" }; } },
  { url: /^https:\/\/api\.open-meteo\.com\/v1\/forecast$/, fn: (m, q) => {
    if (q.latitude == null || q.longitude == null || isNaN(+q.latitude) || isNaN(+q.longitude)) return { status: 400, json: { error: true, reason: "Parameter 'latitude' and 'longitude' must have the same number of elements" } };
    const lat = +q.latitude, lon = +q.longitude;
    const temp = Math.round((32 - Math.abs(lat) * 0.45 + (Math.abs(lon) % 7) * 0.3) * 10) / 10;
    return { json: { latitude: lat, longitude: lon, timezone: "GMT", current_units: { time: "iso8601", temperature_2m: "°C", wind_speed_10m: "km/h" },
      current: { time: "2026-10-22T12:00", interval: 900, temperature_2m: temp, wind_speed_10m: Math.round((Math.abs(lat + lon) % 19) * 10) / 10 } } };
  } },
  { url: /^https:\/\/api\.github\.com\/users\/([^/?]+)$/, fn: (m) => m[1].toLowerCase() === "octocat"
    ? { json: { login: "octocat", id: 583231, name: "The Octocat", company: "@github", public_repos: 8, followers: 20000, following: 9, created_at: "2011-01-25T18:44:36Z" } }
    : { status: 404, json: { message: "Not Found", documentation_url: "https://docs.github.com/rest", status: "404" } } },
  { url: /^https:\/\/httpbin\.org\/status\/(\d{3})$/, fn: (m) => ({ status: +m[1], text: "" }) },
  { url: /^https:\/\/httpbin\.org\/(get|post|put|delete)$/, fn: (m, q, body, form, method) => ({ json: { args: q, json: body ? JSON.parse(body) : null, form, method, url: "https://httpbin.org/" + m[1] } }) }
];
function cqFetch(method, url, params, body, form, extra) {
  if (!/^https?:\/\//.test(url)) return { error: "Invalid URL " + JSON.stringify(url) + ": No scheme supplied. Perhaps you meant https://" + url + "?" };
  let base = url, q = {};
  const qi = url.indexOf("?");
  if (qi >= 0) { base = url.slice(0, qi); url.slice(qi + 1).split("&").filter(Boolean).forEach((kv) => { const [k, v = ""] = kv.split("="); q[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, " ")); }); }
  for (const k in params) if (params[k] != null) q[k] = Array.isArray(params[k]) ? params[k].join(",") : String(params[k]);
  const qs = Object.keys(q).map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(q[k]).replace(/%2C/g, ",")).join("&");
  const full = base + (qs ? "?" + qs : "");
  const routes = (extra || []).concat(CQ_API_DEFAULT);
  for (const r of routes) {
    const m = typeof r.url === "string" ? (r.url === base ? [base] : null) : r.url.exec(base);
    if (!m) continue;
    if (r.method && r.method !== method) continue;
    let res = r.fn ? r.fn(m, q, body, form, method) : { status: r.status, json: r.json, text: r.text };
    if (!res) continue;
    if (res.error) return { error: res.error };
    const status = res.status || 200;
    const text = res.json !== undefined ? JSON.stringify(res.json) : (res.text || "");
    return { url: full, status, text, headers: { "Content-Type": res.json !== undefined ? "application/json" : "text/plain" } };
  }
  return { error: "HTTPSConnectionPool: Failed to resolve '" + base.replace(/^https?:\/\//, "").split("/")[0] + "'. Code Quest's practice internet only knows the addresses used in the lessons." };
}

/* ── Practice databases for sqlite3 and SQL levels (sql.js, asm build) ── */
let cqSQL = null;
function cqSqlReady() { return !!cqSQL; }
async function cqLoadSql() {
  if (cqSQL) return cqSQL;
  if (typeof initSqlJs === "undefined") await loadScript("https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/sql-asm.js");
  cqSQL = await initSqlJs();
  return cqSQL;
}
function cqSqlOpen(name) {
  const R = globalThis.CQRT;
  if (!cqSQL) throw new Sk.builtin.Exception("The database engine is still loading. Run again in a moment.");
  if (name === ":memory:") { const k = ":memory:" + (++R.memN); R.dbs[k] = new cqSQL.Database(); return k; }
  if (!R.dbs[name]) {
    R.dbs[name] = new cqSQL.Database();
    if (R.dbSeed && R.dbSeed[name]) R.dbs[name].exec(R.dbSeed[name]);
  }
  return name;
}
function cqStmtPtr(st) {
  let best = null;
  for (const k of Object.keys(st)) if (typeof st[k] === "number" && (best === null || st[k] > st[best])) best = k;
  return best === null ? 0 : st[best];
}
function cqCountParams(sql) {
  let n = 0, q = null;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (q) { if (c === q) q = null; continue; }
    if (c === "'" || c === '"') q = c;
    else if (c === "?") n++;
  }
  return n;
}
function cqSqlErr(msg) {
  const kind = /constraint failed/i.test(msg) ? "int" : /binding|bindings/i.test(msg) ? "prog" : "op";
  return { error: msg, kind };
}
function cqSqlRun(name, sql, params) {
  const db = globalThis.CQRT.dbs[name];
  if (!db) return cqSqlErr("Cannot operate on a closed database.");
  if (Array.isArray(params)) {
    const want = cqCountParams(sql);
    if (want !== params.length) return cqSqlErr("Incorrect number of bindings supplied. The current statement uses " + want + ", and there are " + params.length + " supplied.");
  }
  let st;
  try {
    st = db.prepare(sql);
    if (Array.isArray(params) ? params.length : params && Object.keys(params).length) {
      const p = Array.isArray(params) ? params : Object.fromEntries(Object.entries(params).map(([k, v]) => [":" + k, v]));
      st.bind(p);
    }
    const ptr = cqStmtPtr(st);
    const rows = [], rowTypes = [];
    let columns = null;
    while (st.step()) {
      if (!columns) columns = st.getColumnNames();
      const r = st.get();
      rows.push(r);
      rowTypes.push(r.map((_, i) => cqSQL._sqlite3_column_type ? cqSQL._sqlite3_column_type(ptr, i) : 0));
    }
    if (!columns) { const cn = st.getColumnNames(); if (cn.length) columns = cn; }
    st.free();
    const changes = columns ? 0 : db.getRowsModified();
    let lastrowid = null;
    if (!columns) { const x = db.exec("SELECT last_insert_rowid()"); lastrowid = x.length ? x[0].values[0][0] : null; }
    return { columns, rows, rowTypes, changes, lastrowid };
  } catch (e) {
    try { if (st) st.free(); } catch (_) {}
    return cqSqlErr(String(e && e.message || e));
  }
}
function cqSqlScript(name, sql) {
  const db = globalThis.CQRT.dbs[name];
  try { db.exec(sql); return {}; } catch (e) { return cqSqlErr(String(e && e.message || e)); }
}
/* Close any transaction a program left open: like a real crash or exit, uncommitted work is lost. */
function cqSqlEndRun() {
  const R = globalThis.CQRT;
  for (const k in R.dbs) { try { R.dbs[k].exec("ROLLBACK"); } catch (_) {} }
}

let cqModsInstalled = false;
function cqInstallModules() {
  if (cqModsInstalled) return;
  cqModsInstalled = true;
  // Skulpt's zero-argument super() checks self.toString(), which calls the class's own __str__ before
  // __init__ has set its attributes. Drop that browser-window check so super().__init__() always works.
  const compile = Sk.compile;
  Sk.compile = function () {
    const r = compile.apply(this, arguments);
    if (r && typeof r.code === "string") r.code = r.code.split('self.toString().indexOf("Window") > 0').join("false");
    return r;
  };
  const F = Sk.builtinFiles.files;
  for (const k of Object.keys(F)) if (/^src\/lib\/(json|os)(\/|\.py$)/.test(k)) delete F[k];
  for (const [n, src] of Object.entries(CQ_PY)) F["src/lib/" + n + ".py"] = src.replace(/^\n/, "");
  for (const [n, fn] of Object.entries(CQ_JS)) F["src/lib/" + n + ".js"] = "var $builtinmodule = " + fn.toString() + ";";
}
