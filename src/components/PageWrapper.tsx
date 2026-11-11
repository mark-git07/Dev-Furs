function PageWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-linear-to-b from-cyan-200 to-white to-[60vh]">
      {props.children}
    </div>
  );
}

export default PageWrapper;