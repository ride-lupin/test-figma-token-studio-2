import { Button } from "./components/Button";
import TestPage from "./pages/TestPage";

function App() {
  if (window.location.pathname === "/test") {
    return <TestPage />;
  }

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h1>Button Component</h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button variants="solid" color="primary" size={56}>
          Primary 56
        </Button>
        <Button variants="solid" color="primary" size={48}>
          Primary 48
        </Button>
        <Button variants="solid" color="primary" size={40}>
          Primary 40
        </Button>
        <Button variants="solid" color="primary" size={32}>
          Primary 32
        </Button>
        <Button variants="solid" color="primary" size={28}>
          Primary 28
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button variants="border" color="primary" size={40}>
          Border Primary
        </Button>
        <Button variants="border" color="gray" size={40}>
          Border Gray
        </Button>
        <Button variants="border" color="red" size={40}>
          Border Red
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button variants="solid" color="gray" size={40}>
          Gray
        </Button>
        <Button variants="solid" color="red" size={40}>
          Red
        </Button>
        <Button variants="solid" color="yellow" size={40}>
          Yellow
        </Button>
        <Button variants="solid" color="green" size={40}>
          Green
        </Button>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button variants="solid" color="primary" size={40} disabled>
          Disabled
        </Button>
        <Button variants="border" color="primary" size={40} disabled>
          Disabled Border
        </Button>
        <Button variants="solid" color="primary" size={40} fullWidth>
          Full Width
        </Button>
      </div>
    </div>
  );
}

export default App;
