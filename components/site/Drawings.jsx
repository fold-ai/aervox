const stages = [
  { number: "01", label: "INPUT", name: "Sensor data", detail: "Aircraft observations" },
  { number: "02", label: "ONBOARD", name: "ACT-1", detail: "Compute and perception" },
  { number: "03", label: "OPERATIONS", name: "PROVE-1", detail: "Control and analysis" }
];

export default function Drawings() {
  return (
    <div className="system-drawings" aria-label="Three stages of the Actprove platform">
      <div className="system-topline">
        <span>ACTPROVE / PLATFORM</span>
        <span>01 - 03</span>
      </div>
      <ol className="system-sequence">
        {stages.map((stage) => (
          <li key={stage.number}>
            <span className="system-sequence-index">{stage.number}</span>
            <div className="system-sequence-main">
              <span>{stage.label}</span>
              <strong>{stage.name}</strong>
            </div>
            <span className="system-sequence-detail">{stage.detail}</span>
          </li>
        ))}
      </ol>
      <div className="system-bottomline">
        <span>ONE CONNECTED WORKFLOW</span>
        <span>CONCEPTUAL VIEW</span>
      </div>
    </div>
  );
}
