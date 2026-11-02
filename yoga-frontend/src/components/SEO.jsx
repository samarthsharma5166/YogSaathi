import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = "https://yogsaathi.com";
const DEFAULT_TITLE = "YogSaathi - Live Online Yoga Classes & Holistic Wellness Community";
const DEFAULT_DESC = "Join YogSaathi for daily interactive live online yoga classes led by expert certified teachers. 7 flexible slots daily (5:00 AM to 7:30 PM) for weight loss, flexibility, meditation & stress relief.";
const DEFAULT_IMAGE = "https://yogsaathi.com/logomain2.png";

/**
 * Reusable SEO component for managing document head tags, canonical URLs,
 * OpenGraph / Twitter metadata, and JSON-LD structured data per route.
 */
export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  canonical,
  keywords,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  schema,
  noindex = false,
}) {
  const location = useLocation();
  const currentPath = canonical || location.pathname;
  const canonicalUrl = currentPath.startsWith("http")
    ? currentPath
    : `${BASE_URL}${currentPath === "/" ? "" : currentPath}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create a meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to update or create a link tag
    const setLinkTag = (rel, href) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Primary Meta Tags
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }
    setMetaTag(
      "name",
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    // 3. Canonical Tag
    setLinkTag("canonical", canonicalUrl);

    // 4. OpenGraph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
    setMetaTag("property", "og:site_name", "YogSaathi");
    setMetaTag("property", "og:locale", "en_IN");

    // 5. Twitter Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);

    // 6. JSON-LD Schema
    const scriptId = "dynamic-route-schema";
    let scriptElement = document.getElementById(scriptId);
    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Optional cleanup
    };
  }, [title, description, canonicalUrl, keywords, ogType, ogImage, schema, noindex]);

  return null;
}

