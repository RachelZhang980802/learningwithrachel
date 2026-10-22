import { notFound } from "next/navigation";
import { Essential4Reader } from "../../Essential4Reader";
export default async function Page({params}:{params:Promise<{articleId:string}>}){ const {articleId}=await params; if(!["01","02","03","04","05"].includes(articleId))notFound(); return <Essential4Reader articleId={articleId} mode="notes"/>;}
