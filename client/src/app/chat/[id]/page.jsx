import Image from "next/image";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoAttachOutline } from "react-icons/io5";
import { AiOutlineAudio } from "react-icons/ai";

export default function Page({ params }) {
  console.log(params);
  return (
    <section>
      <header className="flex items-center gap-4 p-4">
        <Image
        src={"/images/profile-logo.png"} 
        width={40}
        height={40}
        className="rounded-full"
        alt="Display profile"
        />
        <div>
          <h1>Name</h1>
          <p>Message yourself</p>
        </div>
      </header>
      <main className="min-h-screen"></main>
      <footer className="flex justify-center">
        <div className="flex basis-[20%]">
          <MdOutlineEmojiEmotions />
          <IoAttachOutline />
        </div>
        <div className="basis-[60%]">
            <input type="text" name="message" />
        </div>
        <div className="basis-[20%]">
            <AiOutlineAudio/>
        </div>
      </footer>
    </section>
  );
}
