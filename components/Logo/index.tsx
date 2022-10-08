import Image from "next/image";

export default function Logo() {
  return (
    <Image
      style={{
        marginTop: "-70px",
        marginBottom: "-70px",
        height: "215px",
        width: "auto",
      }}
      width={500}
      height={215}
      className="mx-auto h-48 w-auto"
      src="http://avisos.jonatas.app/logo-sim-500-215.png"
      alt="Workflow"
    />
  );
}
