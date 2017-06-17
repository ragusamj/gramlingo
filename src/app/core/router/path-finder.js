class PathFinder {

    constructor(routes) {
        this.routes = routes;
    }

    getRoute(path) {
        if(path) {
            return this.findRoute(path) || this.findRoute("*");
        }
        return undefined;
    }

    findRoute(path) {
        for(let route of this.routes) {
            for(let pattern of route.paths) {
                let match = this.match(pattern, path);
                if(match) {
                    return {
                        page: route.page,
                        parameters: match,
                        path: path,
                        template: route.template
                    };
                }
            }
        }
    }

    match(pattern, path) {
        let match = {};
        let patternParts = pattern.split("/");
        let pathParts = path.split("/");
        if(patternParts.length === pathParts.length) {
            for(let i = 0; i < patternParts.length; i++) {
                if(patternParts[i][0] === ":") {
                    let key = patternParts[i].substring(1);
                    match[key] = decodeURIComponent(pathParts[i]);
                    continue;
                }
                if(patternParts[i] !== pathParts[i]) {
                    return undefined;
                }
            }
            return match;
        }
        return undefined;
    }
}

export default PathFinder;
