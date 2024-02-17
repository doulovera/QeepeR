export const Header = () => {
  return (
    <header className="flex items-center justify-center w-80 h-20 p-4 mx-auto">
      <nav className="w-full">
        <ul className="flex justify-between w-full">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/qr" className="opacity-70 cursor-not-allowed">My QRs</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/login">Log in</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}