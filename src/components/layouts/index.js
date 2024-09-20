
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
function Layout({ children }) {
    return (
        <body class="sb-nav-fixed">
            <Header />
            <Navbar />
            <div id="layoutSidenav">
                <SideBar />
                <div id="layoutSidenav_content">
                    <main>
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </body>
    );
}

export default Layout;