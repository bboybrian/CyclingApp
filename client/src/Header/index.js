const Header = ({children}) => {
    return (
    <div className="Topnav">
        <div className="TopnavContents">
            {children}
        </div>
    </div>
    );
}

export default Header;