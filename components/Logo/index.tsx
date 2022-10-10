import Image from "next/image";

export default function Logo() {
  return (
    <Image
      style={{
        marginTop: "-70px",
        marginBottom: "-70px",
        height: "76px",
        width: "auto",
      }}
      width={176.725}
      height={76}
      className="mx-auto h-48 w-auto"
      src="/logo-sim-500-215.png"
      alt="Workflow"
    />
  );
}
