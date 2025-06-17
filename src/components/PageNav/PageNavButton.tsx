import "./PageNavButton.css";

interface Props {
  id: string;
  label: string;
  href: string;
  onPointerDown: React.PointerEventHandler;
  //   onMouseUp: React.MouseEventHandler;
}

export function PageNavButton({ id, label, href, onPointerDown }: Props) {
  return (
    <div className="PageNavButton" onPointerDown={onPointerDown} data-id={id}>
      <a href={href}>{label}</a>
      <button className="PageNavButton__menu-button">︙</button>
    </div>
  );
}
