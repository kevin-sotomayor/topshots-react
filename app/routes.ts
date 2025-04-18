import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


export default [
	index("./routes/home.tsx"),
	// route("/projects", "/routes/projects.tsx"),
	// route("/team", "/routes/team.tsx"),
] satisfies RouteConfig;
