"use client";

export default function ColorLegends() {
  return (
    <div style={{ display: "block", width: "100%", marginTop: "1rem", marginBottom: "1rem" }}>
      <style>{`
        @media (min-width: 769px) {
          .color-legends-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div className="color-legends-mobile">
        {/* Observed Water Level Legend */}
        <div style={{ backgroundColor: "#e4e5e6", padding: "0.75rem", marginBottom: "0.75rem", borderRadius: "4px" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#A32638", textAlign: "center", marginBottom: "0.75rem" }}>
            Observed Water Level
          </div>
          <div style={{ backgroundColor: "#b53ef5", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>MAJOR FLOOD</div>
          <div style={{ backgroundColor: "#f44336", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>MODERATE FLOOD</div>
          <div style={{ backgroundColor: "#ffb74d", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>MINOR FLOOD</div>
          <div style={{ backgroundColor: "#ffff66", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>NEAR FLOOD</div>
          <div style={{ backgroundColor: "#69f0ae", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>NORMAL LEVELS</div>
          <div style={{ backgroundColor: "#9e9e9e", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>BLOWOUT</div>
          <div style={{ backgroundColor: "white", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center", border: "1px solid #999" }}>MODEL PREDICTIONS ONLY</div>
          <div style={{ fontSize: "0.65rem", marginTop: "0.5rem", color: "#555", textAlign: "center", lineHeight: "1.3" }}>
            Marker color indicates current water level. Blinking markers indicate predicted flooding.
          </div>
        </div>

        {/* Flood Inundation Legend */}
        <div style={{ backgroundColor: "#e4e5e6", padding: "0.75rem", marginBottom: "0.75rem", borderRadius: "4px" }}>
          <div style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#A32638", textAlign: "center", marginBottom: "0.75rem" }}>
            Flood Inundation
          </div>
          <div style={{ fontSize: "0.8rem", marginBottom: "0.5rem", fontWeight: "600", color: "#A32638", textAlign: "center" }}>
            Flood Depth Legend
          </div>
          <div style={{ backgroundColor: "#b3e5fc", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>&lt; 1 FOOT</div>
          <div style={{ backgroundColor: "#4fc3f7", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>1-2 FEET</div>
          <div style={{ backgroundColor: "#039be5", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>2-3 FEET</div>
          <div style={{ backgroundColor: "#01579b", color: "black", fontSize: "0.7rem", padding: "0.35rem", fontWeight: "bold", marginBottom: "0.25rem", textAlign: "center" }}>3 &lt; FEET</div>
        </div>
      </div>
    </div>
  );
}
