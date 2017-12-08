"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var response_1 = require("../response");
var Router = (function () {
    function Router(request, container) {
        this.request = request;
        this.container = container;
        this.middleware = [];
    }
    Router.prototype.route = function (routes) {
        var requestRoute = this.request.getResource();
        var requestMethod = this.request.getRequestMethod();
        var routeGroup = routes.routes[requestRoute];
        this.addMiddlewareIfExists(routes.middleware);
        this.addMiddlewareIfExists(routeGroup.middleware);
        if (routeGroup[requestMethod] === undefined) {
            throw Error("Request method, '" + requestMethod
                + ", does not exists on route, " + requestRoute + "'.");
        }
        this.subjectRoute = routeGroup[requestMethod];
        this.addRouteMetaDataToRequest();
        this.addMiddlewareIfExists(this.subjectRoute.middleware);
    };
    Router.prototype.addRouteMetaDataToRequest = function () {
        var narrowedRoute = {};
        for (var prop in this.subjectRoute) {
            if (this.subjectRoute.hasOwnProperty(prop) && prop != 'controller' && prop != 'middleware') {
                narrowedRoute[prop] = this.subjectRoute[prop];
            }
        }
        this.request.RouteMetaData = narrowedRoute;
    };
    Router.prototype.addMiddlewareIfExists = function (middleware) {
        if (middleware !== undefined) {
            this.middleware = this.middleware.concat(middleware);
        }
    };
    Router.prototype.dispatchMiddleware = function () {
        var _this = this;
        var promises = this.middleware.map(function (constructor) { return _this.container.resolve(constructor); })
            .map(function (object) { return object.handle(_this.request); });
        return Promise.all(promises);
    };
    Router.prototype.dispatchController = function () {
        return __awaiter(this, void 0, void 0, function () {
            var subjectController, response, e_1, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        subjectController = this.container.resolve(this.subjectRoute.controller);
                        return [4, subjectController[this.subjectRoute["function"]](this.request)];
                    case 1:
                        response = _a.sent();
                        return [2, response];
                    case 2:
                        e_1 = _a.sent();
                        body = {
                            'Error Message': e_1.message,
                            'Mindless Message': 'Unable to resolve requested controller or method make sure your routes are configured properly'
                        };
                        return [2, new response_1.Response(500, body)];
                    case 3: return [2];
                }
            });
        });
    };
    return Router;
}());
exports.Router = Router;
//# sourceMappingURL=router.js.map