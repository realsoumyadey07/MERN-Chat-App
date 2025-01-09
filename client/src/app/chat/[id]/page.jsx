import Image from "next/image";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoAttachOutline } from "react-icons/io5";

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
          <p className="text-gray-500">Message yourself</p>
        </div>
      </header>
      <main className="min-h-[80vh]"></main>
      <footer className="flex justify-center items-center px-4">
        <div className="flex lg:basis-[10%] basis-[20%] justify-around">
          <MdOutlineEmojiEmotions />
          <IoAttachOutline />
        </div>
        <div className="basis-[80%] lg:basis-[90%]">
            <input className="w-full border-none outline-none" placeholder="Type your message here" type="text" name="message" />
        </div>
      </footer>
    </section>
  );
}
