function Container(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      {props.children}
    </div>
  );
}

export default Container;