import { Link } from "react-router-dom";
import config from "../../config";

function SideBar() {
	return (
		<div id="layoutSidenav_nav">
			<nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
				<div className="sb-sidenav-menu">
					<div className="nav">
						<Link className="nav-link" to={config.routes.home}>
							<div className="sb-nav-link-icon"><i className="fas fa-home"></i></div>
							Dashboard
						</Link>

						<Link className="nav-link" to={config.routes.user_list}>
							<div className="sb-nav-link-icon"><i className="fas fa-user"></i></div>
							User
						</Link>

						<Link className="nav-link" to={config.routes.category_list}>
							<div className="sb-nav-link-icon"><i className="fas fa-list"></i></div>
							Category
						</Link>

						<Link className="nav-link" to={config.routes.destination_list}>
							<div className="sb-nav-link-icon"><i className="fas fa-location"></i></div>
							Destination
						</Link>
						
					</div>
				</div>
				<div className="sb-sidenav-footer">
					<div className="small">Logged in as:</div>
					ADMIN
				</div>
			</nav>
		</div>
	);
}

export default SideBar;
