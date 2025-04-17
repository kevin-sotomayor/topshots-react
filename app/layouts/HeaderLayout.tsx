import "../styles/header.css";


export function HeaderLayout() {
	return (
		<header>
			<span>Topshots</span>
			<nav>
				<ul>
					<li>
						<a href="/">Accueil</a>
					</li>
					<li>
						<a href="/projects">Projets</a>
					</li>
				</ul>
			</nav>
		</header>
	)
}