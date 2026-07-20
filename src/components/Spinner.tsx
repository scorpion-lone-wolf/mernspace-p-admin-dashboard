import { Flex, Spin } from "antd";
import type { CSSProperties, ReactNode } from "react";

interface SpinnerProps {
  size?: "small" | "default" | "large";
  tip?: ReactNode;
  fullPage?: boolean;
  className?: string;
  style?: CSSProperties;
}

function Spinner({ size = "large", tip, fullPage = true, className, style }: Readonly<SpinnerProps>) {
  if (fullPage) {
    return (
      <Flex align="center" justify="center" className={className} style={{ minHeight: "100vh", width: "100%", ...style }}>
        <Spin size={size} description={tip} />
      </Flex>
    );
  }

  return <Spin size={size} description={tip} className={className} style={style} />;
}

export default Spinner;
