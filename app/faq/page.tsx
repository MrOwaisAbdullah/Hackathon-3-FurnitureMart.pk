import React from "react";
import { poppins } from "../fonts";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";

const page = () => {
  return (
    <div
      className={`${poppins.className} m-auto pt-28 xl:px-0 px-8 -mb-28 max-w-7xl`}
    >
      {/* Breadcrumb */}
      <nav className="mb-6 mx-5">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-800">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-800">FAQ&apos;S</li>
        </ol>
      </nav>

      <h2 className={`heading text-center font-semibold text-4xl`}>
        Questions Looks Here
      </h2>
      <p className={`xl:px-40 text-center text-[#9F9F9F]`}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the{" "}
      </p>

      <div className="flex flex-wrap gap-5 py-20">
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
        <div className="bg-[#f7f7f7] xl:w-[48%] p-7 rounded-[8px]">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-6">
              What types of chairs do you offer?
            </h2>
            <FaPlus />
          </div>
          <p className="text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quis
            modi ullam amet debitis libero veritatis enim repellat optio natus
            eum delectus deserunt, odit expedita eos molestiae ipsa totam
            quidem?
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
