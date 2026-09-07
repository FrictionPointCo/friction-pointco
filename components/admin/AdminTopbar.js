import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminTopbar() {
  return (
    <div className="admin-topbar">
      <Link className="brand-mini" href="/admin">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/brand/logo-mark.png" alt="Friction Point" />
        <span>FRICTION POINT <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>/ admin</span></span>
      </Link>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link className="btn btn-outline" href="/" style={{ padding: "8px 16px", fontSize: "12px" }} target="_blank">
          VIEW SITE
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
