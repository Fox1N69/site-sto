import Image from "next/image";
import style from "./banner.module.scss";

export default function Banner() {
  return (
    <section id={style.banner}>
      <div className={style["banner__container"]}>
        <Image
          src={"/banner.png"}
          width={1920}
          height={1080}
          alt={"banner image"}
        />
      </div>
    </section>
  );
}
