import config from "../../config";

const BreadCrumb = ({ title, path }) => {
	return (


		<ol class="breadcrumb mb-4">
			<li class="breadcrumb-item active">{title}</li>
		</ol>
	);
}

BreadCrumb.defaultProps = {
	path: config.routes.home,
};
export default BreadCrumb;