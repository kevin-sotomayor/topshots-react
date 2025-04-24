import "../styles/header.css";
import logo from "../../assets/logo/logo.png";


export function HeaderComponent() {
	return (
		<header className="app-header">
			{/* <span className="app-header__logo">Topshots</span> */}
			<a className="app-header__logo" href="/">
				<img src={logo} alt="" />
			</a>
			<nav className="app-header__nav">
				<ul>
					<li><a href="/">Accueil</a></li>
					<li><a href="/projects">Nos projets</a></li>
					<li><a href="/team">L'équipe</a></li>
				</ul>
			</nav>
		</header>
	)
}