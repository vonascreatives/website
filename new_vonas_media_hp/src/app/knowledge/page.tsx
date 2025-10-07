import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vonas Media - Knowledge Base",
};

const KnowledgeBasePage = async () => {
  // Redirect to the knowledge-base page
  redirect('/knowledge-base');
};

export default KnowledgeBasePage;
