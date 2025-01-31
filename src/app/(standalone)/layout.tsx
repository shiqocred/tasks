import UserButton from "@/components/user-button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const StandaloneLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link
            href={"/"}
            className="flex items-center gap-3 h-8 group-data-[collapsible=icon]/35"
          >
            <div className="flex aspect-square items-center justify-center rounded-lg transition-all size-8">
              <svg
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all size-8"
              >
                <path
                  d="M6.6 33.19C7.0363 33.19 7.39 29.5232 7.39 25C7.39 20.4768 7.0363 16.81 6.6 16.81C6.16369 16.81 5.81 20.4768 5.81 25C5.81 29.5232 6.16369 33.19 6.6 33.19Z"
                  fill="black"
                ></path>
                <path
                  d="M8.7 34.1C9.18601 34.1 9.58 30.0258 9.58 25C9.58 19.9742 9.18601 15.9 8.7 15.9C8.21399 15.9 7.82 19.9742 7.82 25C7.82 30.0258 8.21399 34.1 8.7 34.1Z"
                  fill="black"
                ></path>
                <path
                  d="M11.04 35.12C11.5757 35.12 12.01 30.5891 12.01 25C12.01 19.4109 11.5757 14.88 11.04 14.88C10.5043 14.88 10.07 19.4109 10.07 25C10.07 30.5891 10.5043 35.12 11.04 35.12Z"
                  fill="black"
                ></path>
                <path
                  d="M13.63 36.24C14.2265 36.24 14.71 31.2077 14.71 25C14.71 18.7923 14.2265 13.76 13.63 13.76C13.0335 13.76 12.55 18.7923 12.55 25C12.55 31.2077 13.0335 36.24 13.63 36.24Z"
                  fill="black"
                ></path>
                <path
                  d="M16.51 37.49C17.1727 37.49 17.71 31.898 17.71 25C17.71 18.102 17.1727 12.51 16.51 12.51C15.8473 12.51 15.31 18.102 15.31 25C15.31 31.898 15.8473 37.49 16.51 37.49Z"
                  fill="black"
                ></path>
                <path
                  d="M19.72 38.88C20.4545 38.88 21.05 32.6657 21.05 25C21.05 17.3343 20.4545 11.12 19.72 11.12C18.9855 11.12 18.39 17.3343 18.39 25C18.39 32.6657 18.9855 38.88 19.72 38.88Z"
                  fill="black"
                ></path>
                <path
                  d="M23.28 40.42C24.0974 40.42 24.76 33.5162 24.76 25C24.76 16.4838 24.0974 9.58 23.28 9.58C22.4626 9.58 21.8 16.4838 21.8 25C21.8 33.5162 22.4626 40.42 23.28 40.42Z"
                  fill="black"
                ></path>
                <path
                  d="M27.23 42.13C28.1413 42.13 28.88 34.4606 28.88 25C28.88 15.5394 28.1413 7.87 27.23 7.87C26.3187 7.87 25.58 15.5394 25.58 25C25.58 34.4606 26.3187 42.13 27.23 42.13Z"
                  fill="black"
                ></path>
                <path
                  d="M31.62 44.04C32.6307 44.04 33.45 35.5155 33.45 25C33.45 14.4845 32.6307 5.96 31.62 5.96C30.6093 5.96 29.79 14.4845 29.79 25C29.79 35.5155 30.6093 44.04 31.62 44.04Z"
                  fill="black"
                ></path>
                <path
                  d="M36.5 46.15C37.6211 46.15 38.53 36.6808 38.53 25C38.53 13.3192 37.6211 3.85 36.5 3.85C35.3789 3.85 34.47 13.3192 34.47 25C34.47 36.6808 35.3789 46.15 36.5 46.15Z"
                  fill="black"
                ></path>
                <path
                  d="M41.92 48.5C43.1682 48.5 44.18 37.9787 44.18 25C44.18 12.0213 43.1682 1.5 41.92 1.5C40.6718 1.5 39.66 12.0213 39.66 25C39.66 37.9787 40.6718 48.5 41.92 48.5Z"
                  fill="black"
                ></path>
              </svg>
            </div>
            <div className="text-left text-xl leading-tight group-data-[state=open]/collapsible:rotate-90">
              <p className="truncate font-semibold">So-Tasks</p>
            </div>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StandaloneLayout;
