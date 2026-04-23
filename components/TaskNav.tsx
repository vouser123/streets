// components/TaskNav.tsx — Shared task-first route navigation for Streets.

import Link from "next/link";
import styles from "@/components/TaskNav.module.css";

const TASK_LINKS = [
  { href: "/practice", label: "Practice" },
  { href: "/timing", label: "Timing Setup" },
  { href: "/calibration", label: "Calibration" },
  { href: "/exemplars", label: "Exemplars" },
  { href: "/preferences", label: "Preferences" },
];

export function TaskNav() {
  return (
    <nav aria-label="Primary" className={styles.nav}>
      {TASK_LINKS.map((link) => (
        <Link key={link.href} className={styles.link} href={link.href}>
          {link.label}
        </Link>
      ))}
      <a className={styles.link} href="/legacy-prototype.html">
        Legacy Prototype
      </a>
    </nav>
  );
}
