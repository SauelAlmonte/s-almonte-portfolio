import React from "react";
import BlogsCard from "@/components/Home/Blogs/BlogsCard";
import { blogLinks } from "@/constants/blogsLinkConstant";

const Blogs = () => {
    return (
        <div className="py-16">
            <h2 className="text-center text-2xl md:text-4xl xl:text5xl font-bold text-zinc-50">
                My Recent<br />
                <span className="text-cyan-300">Blogs</span>
            </h2>
            <div className="mx-auto max-w-7xl p-10 ">
                <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 gap-10 items-center">
                    {blogLinks.map(blog => (
                        <BlogsCard
                            key={blog.href}
                            image={blog.image}
                            title={blog.title}
                            date={blog.date}
                            href={blog.href}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Blogs;