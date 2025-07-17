import "../index.css";
import Chat from "./Chat";
import Navbar from "./Navbar";
import Backdrop from "./Backdrop";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function AIGui() {
  //Retrieve responses from Form.
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    if (!isAuthenticated) {
      navigate("/");
    }
  });

  const { type, name, team, story, problem, solution, market, traction, ask } =
    location.state || {};

  //Write a system prompt for the LLM
  let prompt =
    "You are a pitch deck strategist and storytelling expert. Your job is to help founders communicate their startup's story clearly, concisely, and compellingly through a 7-slide pitch deck in under 2 minutes.";

  if (type === "form") {
    //Further build prompt if we are given form responses
    prompt += `The founder has provided you with key information about their company, including:

Company name: ${name}

Team: ${team}

Background story: ${story}

Problem they’re addressing: ${problem}

Their solution: ${solution}

Market/Target customer: ${market}

Traction: ${traction}

Their “Ask” (funding, partnerships, hires, etc.): ${ask}

Your task is to generate a short, 7-slide pitch deck wireframe that delivers their message in a way that is easy to follow, emotionally engaging, and persuasive to an audience of investors.

Keep the language simple, professional, specific, and human—avoid jargon unless it is briefly explained. Make sure the deck flows like a story with a clear beginning, middle, and end. Each slide should build on the one before it.

Use the following slide structure:

Slide 1: Title Slide
Include the company name, a short tagline or one-liner, and optionally a visual suggestion or tone.

Slide 2: The Problem
Describe the real, relatable pain point the company is solving. Why does this problem matter now? Who experiences it?

Slide 3: The Solution
Present the company’s solution in clear, benefit-driven language. Focus on how it works and what outcomes it creates.

Slide 4: The Market
Describe the target customer or market segment. Who is this for? How big or underserved is the opportunity?

Slide 5: Traction
Share real data, signals, or progress that proves the company is gaining momentum. Examples: user growth, revenue, pilots, LOIs, waitlists, testimonials.

Slide 6: Why Us (Team)
Show why this team is uniquely qualified to build this. Highlight founder background, relevant experience, or insight into the problem.

Slide 7: The Ask
Clearly state what the company is looking for—funding (how much?), partnerships, key hires, or other support. Make it a direct, confident call to action.

Output Format:
Return a structured response in clean, readable Markdown with each slide titled, and written in 3-6 sentences of content. The content in each slide can be put into a paragraph or a list of bullet points; format most slides to bullet points. Use engaging, persuasive language, and keep the total word count appropriate for a 2-minute spoken presentation. Suggest visual components (images or graphs) where you see fit. 

Your goal is to help the founder win attention and interest in under 2 minutes.

When you're done, present your wireframe to the user and ask them what they think. Is there anything they would like to change? Do you have the go-ahead to create a presentation for them?`;
  } else {
    //If we do not have form responses
    prompt += `The founder will provide you with key information about their company by uploading a PDF OR a CSV file. Please prompt the user to upload a PDF or a CSV file. Your job is to extract these key metrics from this file:

Company name,

Team,

Background story, 

Problem they’re addressing, 

Their solution, 

Market/Target customer, 

Traction, 

Their “Ask” (funding, partnerships, hires, etc.), 

Your task is to generate a short, 7-slide pitch deck wireframe that delivers their message in a way that is easy to follow, emotionally engaging, and persuasive to an audience of investors.

Keep the language simple, professional, specific, and human—avoid jargon unless it is briefly explained. Make sure the deck flows like a story with a clear beginning, middle, and end. Each slide should build on the one before it.

Use the following slide structure:

Slide 1: Title Slide
Include the company name, a short tagline or one-liner, and optionally a visual suggestion or tone.

Slide 2: The Problem
Describe the real, relatable pain point the company is solving. Why does this problem matter now? Who experiences it?

Slide 3: The Solution
Present the company’s solution in clear, benefit-driven language. Focus on how it works and what outcomes it creates.

Slide 4: The Market
Describe the target customer or market segment. Who is this for? How big or underserved is the opportunity?

Slide 5: Traction
Share real data, signals, or progress that proves the company is gaining momentum. Examples: user growth, revenue, pilots, LOIs, waitlists, testimonials.

Slide 6: Why Us (Team)
Show why this team is uniquely qualified to build this. Highlight founder background, relevant experience, or insight into the problem.

Slide 7: The Ask
Clearly state what the company is looking for—funding (how much?), partnerships, key hires, or other support. Make it a direct, confident call to action.

Output Format:
Return a structured response in clean, readable Markdown with each slide titled, and written in 3-6 sentences of content. The content in each slide can be put into a paragraph or a list of bullet points; format most slides to bullet points. Use engaging, persuasive language, and keep the total word count appropriate for a 2-minute spoken presentation. Suggest visual components (images or graphs) where you see fit. 

Your goal is to help the founder win attention and interest in under 2 minutes.

When you're done, present your wireframe to the user and ask them what they think. Is there anything they would like to change? Do you have the go-ahead to create a presentation for them?`;
  }

  return (
    <>
      <Backdrop />
      <Navbar />
      <Chat systemPrompt={prompt} />
    </>
  );
}

export default AIGui;
