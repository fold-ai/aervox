import { usEmployeeBenefits, employeeBenefitsNote } from "@/lib/careers/compensation";
import styles from "@/app/(public)/careers/careers.module.css";

export default function CareerBenefits({ compact = false }) {
  return <div className={compact ? styles.roleBenefits : styles.benefitsContent}>
    <span className={styles.label}>U.S. EMPLOYEE BENEFITS</span>
    <h2>Built to support your work.</h2>
    <dl className={styles.benefitsGrid}>{usEmployeeBenefits.map(benefit => <div key={benefit.title}><dt>{benefit.title}</dt><dd>{benefit.description}</dd></div>)}</dl>
    <p className={styles.fine}>{employeeBenefitsNote}</p>
  </div>;
}
