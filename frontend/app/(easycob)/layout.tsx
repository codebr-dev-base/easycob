import Sidebar from "./components/Sidebar";

export default function EasycobLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <section>
      <Sidebar>{children}</Sidebar>
    </section>
  );
}
