import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** App favicon — charcoal tile + lime progress ring. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #243016 0%, #12161c 100%)",
          borderRadius: 10,
          border: "1.5px solid #2a3140",
          position: "relative",
        }}
      >
        {/* Track */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: 999,
            border: "2.5px solid #2f3a28",
          }}
        />
        {/* Progress arc approximation via clipped lime ring */}
        <div
          style={{
            position: "absolute",
            width: 20,
            height: 20,
            borderRadius: 999,
            border: "2.75px solid #b8ff40",
            borderRightColor: "transparent",
            borderBottomColor: "transparent",
            transform: "rotate(-45deg)",
          }}
        />
        {/* Core */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "#b8ff40",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 3,
              height: 3,
              borderRadius: 999,
              background: "#0f1408",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
