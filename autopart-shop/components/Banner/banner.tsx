import Image from "next/image";
import style from "./banner.module.scss";
import BannerSwiper from "./BannerSwiper";

export default function Banner() {
  return (
    <section id={style.banner}>
      <div className={style["banner__container"]}>
        <BannerSwiper />
      </div>
    </section>
  );
}
