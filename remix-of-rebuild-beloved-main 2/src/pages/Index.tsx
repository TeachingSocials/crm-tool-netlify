import { useState, useCallback } from "react";
import { CyberGrid, FloatingNodes, Scanlines } from "@/components/CyberBackground";
import { IntroOverlay } from "@/components/IntroOverlay";
import { CRMHeader } from "@/components/CRMHeader";
import { MainConsole } from "@/components/MainConsole";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "hsl(205 30% 8%)", position: "relative" }}>
      <CyberGrid />
      <FloatingNodes />
      <Scanlines />

      {!introComplete && <IntroOverlay onComplete={handleIntroComplete} />}

      <div style={{ position: "relative", zIndex: 10 }}>
        <CRMHeader visible={introComplete} />
        <MainConsole visible={introComplete} />
      </div>
    </div>
  );
};

export default Index;
