import { Button } from "../components/Button";

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#667085", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {title}
      </h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        {children}
      </div>
    </section>
  );
}

export default function TestPage() {
  return (
    <div style={{ padding: "48px", fontFamily: "Pretendard, sans-serif", maxWidth: "900px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "40px", color: "#101828" }}>
        Button — /test
      </h1>

      {/* Type: Fill */}
      <Section title="Type · Fill">
        <Button variants="solid" color="primary" size={56}>Button</Button>
        <Button variants="solid" color="primary" size={48}>Button</Button>
        <Button variants="solid" color="primary" size={40}>Button</Button>
        <Button variants="solid" color="primary" size={32}>Button</Button>
        <Button variants="solid" color="primary" size={28}>Button</Button>
      </Section>

      {/* Type: Border */}
      <Section title="Type · Border">
        <Button variants="border" color="primary" size={56}>Button</Button>
        <Button variants="border" color="primary" size={48}>Button</Button>
        <Button variants="border" color="primary" size={40}>Button</Button>
        <Button variants="border" color="primary" size={32}>Button</Button>
        <Button variants="border" color="primary" size={28}>Button</Button>
      </Section>

      {/* Type: Light Solid */}
      <Section title="Type · Light Solid">
        <Button variants="lightSolid" color="primary" size={56}>Button</Button>
        <Button variants="lightSolid" color="primary" size={48}>Button</Button>
        <Button variants="lightSolid" color="primary" size={40}>Button</Button>
        <Button variants="lightSolid" color="primary" size={32}>Button</Button>
        <Button variants="lightSolid" color="primary" size={28}>Button</Button>
      </Section>

      {/* Color */}
      <Section title="Color (size 40 · Fill)">
        <Button variants="solid" color="primary" size={40}>Primary</Button>
        <Button variants="solid" color="gray" size={40}>Neutral</Button>
        <Button variants="solid" color="red" size={40}>Negative</Button>
        <Button variants="solid" color="yellow" size={40}>Warning</Button>
        <Button variants="solid" color="green" size={40}>Positive</Button>
      </Section>

      {/* Color · Border */}
      <Section title="Color (size 40 · Border)">
        <Button variants="border" color="primary" size={40}>Primary</Button>
        <Button variants="border" color="gray" size={40}>Neutral</Button>
        <Button variants="border" color="red" size={40}>Negative</Button>
        <Button variants="border" color="yellow" size={40}>Warning</Button>
        <Button variants="border" color="green" size={40}>Positive</Button>
      </Section>

      {/* State: Disabled */}
      <Section title="State · Disabled">
        <Button variants="solid" color="primary" size={40} disabled>Primary</Button>
        <Button variants="border" color="primary" size={40} disabled>Primary</Button>
        <Button variants="solid" color="gray" size={40} disabled>Neutral</Button>
        <Button variants="solid" color="red" size={40} disabled>Negative</Button>
      </Section>

      {/* Full Width */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: 600, color: "#667085", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          Full Width
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
          <Button variants="solid" color="primary" size={56} fullWidth>Button</Button>
          <Button variants="border" color="primary" size={40} fullWidth>Button</Button>
        </div>
      </section>
    </div>
  );
}
