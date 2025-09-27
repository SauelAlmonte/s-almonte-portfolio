import React from "react";
import BlogsCard from "@/components/Home/Blogs/BlogsCard";
import {blogLinks} from "@/constants/blogsLinkConstant";
import UnderConstruction from "@/components/UnderConstruction";

const Blogs = () => {
    return (
        <section className="py-24 relative mt-10">
            <h2 className="text-center text-2xl md:text-4xl xl:text-5xl font-bold text-zinc-50 mb-4">
                My Recent<br/>
                <span className="text-cyan-300">Blogs</span>
            </h2>
            <div className="mx-auto max-w-7xl p-8">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 md:gap-6 items-center justify-center">
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
            <UnderConstruction/>
        </section>
    )
}
export default Blogs;