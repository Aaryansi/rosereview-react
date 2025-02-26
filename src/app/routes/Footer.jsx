import { FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-black py-6 text-center mt-10">
      <p className="text-lg">
        Made with <FaHeart className="inline text-red-500 animate-pulse mx-1" /> at Rose-Hulman by{" "}
        <a href="https://aaryansi.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-500 font-semibold">
          Aaryan
        </a>
      </p>
    </footer>
  );
}
