import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import LogOut from "../pages/login/Logout";
import "./../App.scss";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import navLogo from "./../pages/images/nav_logo.png";

const Navigation = () => {
  const session = window.sessionStorage;
  //console.log(session);
  return (
    <Navbar bg="white" expand="lg" className="navBar">
      <Container>
        <Navbar.Brand href="/" id="brandName">
          <img src={navLogo} style={{ width: "20%" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/join"
              className={
                sessionStorage.length >= 1 ? `join-nav-off` : `join-nav-on`
              }
            >
              회원가입
            </Nav.Link>
            <Nav.Link
              href="/login"
              className={
                sessionStorage.length >= 1 ? `login-nav-off` : `login-nav-on`
              }
            >
              로그인
            </Nav.Link>
            {/* <Nav.Link href="/mypage">
              <HiOutlinePencilSquare style={{ scale: "2" }} />
            </Nav.Link>

            <Nav.Link>
              <LogOut />
            </Nav.Link> */}

            <NavDropdown
              title={<HiOutlinePencilSquare style={{ scale: "1.8" }} />}
              id="basic-nav-dropdown"
              className={
                sessionStorage.length >= 1 ? `MyPage-nav-on` : `MyPage-nav-off`
              }
            >
              <NavDropdown.Item href="/mypage">나의 일기장</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                <LogOut />
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
