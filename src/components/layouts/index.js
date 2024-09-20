
import Footer from "./Footer";
import SideBar from "./SideBar";
function Layout({ children }) {
    return (
        <body class="page-body page-fade"> 
            <SideBar />
            <div className="content-wrapper">
                <div className="container-full">
                    {children}
                </div>
            </div>
            <Footer />
            </body>
    );
}

export default Layout;