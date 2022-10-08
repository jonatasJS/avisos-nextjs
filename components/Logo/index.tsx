import Image from "next/image";

export default function Logo() {
  return (
    <Image
      style={{
        marginTop: "-70px",
        marginBottom: "-70px",
        height: "107.5px",
        width: "auto",
      }}
      width={250}
      height={107.5}
      className="mx-auto h-48 w-auto"
      src="/logo-sim-500-215.png"
      alt="Workflow"
    />
  );
}
