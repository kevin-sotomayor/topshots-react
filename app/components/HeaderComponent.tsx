import "../styles/header.css";


export function HeaderComponent() {
	return (
		<header className="app-header">
			<span className="app-header__logo">Topshots</span>
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