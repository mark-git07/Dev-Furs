function Header() {
  return (
    <header>
          {/* Logo */}
          <a className="group" href="/">
            <div className="inline-flex items-center gap-4">
              <img
                src="/images/logo.png"
                alt="DevKitties"
                className="h-16 transition group-hover:scale-105 group-hover:-rotate-6 md:h-20 lg:h-24"
              />
              <p className="text-lg font-semibold">Dev Kitties</p>
            </div>
          </a>
          {/* Hero copy */}
          <div className="mt-6">
            <h1 className="text-lg font-bold">We've got the best kitties!</h1>
            <p className="text-slate-600">
              Don't take our word — let the pictures do the talking :)
            </p>
          </div>
        </header>
  );
}

export default Header;