/**
 * slothing.sty — the document contract's LaTeX implementation, as a module.
 *
 * Kept as a TS string rather than a loose .sty asset on purpose: Next does not copy
 * arbitrary files into the server bundle, so a runtime readFile of an asset path works in
 * dev and fails in production. This is the SINGLE source of truth — the compile service
 * writes it into each jail and the "Download for Overleaf" zip writes the same bytes, so
 * the two can never drift.
 *
 * See docs/specs/latex-single-source-rebuild.md §3.5.
 */
export const SLOTHING_STY = String.raw`%% slothing.sty — the Slothing document contract, v1.
%%
%% Shipped by the app and injected into the compile working directory; it is NOT stored
%% inside user documents, so macro implementations can be fixed centrally.
%% See docs/specs/latex-single-source-rebuild.md §3.
%%
%% Every addressable macro takes an optional [id=...] argument. The .sty deliberately
%% IGNORES it: rendering is this file's job, addressing is the TS scanner's job. Keeping
%% the id opaque here means the scanner is the single authority on document structure.
\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{slothing}[2026/08/21 v1 Slothing document contract]

\RequirePackage{keyval}
\RequirePackage{geometry}
\RequirePackage{enumitem}
\RequirePackage{titlesec}
\RequirePackage{xcolor}
\RequirePackage{hyperref}
\hypersetup{hidelinks}

%% --- contract version -------------------------------------------------------
%% Declared by every document. The .sty supports the current version and one back.
\newcommand{\slothingcontract}[1]{\def\slothing@contract{#1}}
\def\slothing@contract{1}

%% --- settings ---------------------------------------------------------------
%% The closed key set from §3.2. Unknown keys are an error at compile time, which
%% mirrors the Zod schema rejecting them on the app side.
\def\slothing@font{LatinModern}
\def\slothing@fontsize{11pt}
\def\slothing@margin{0.5in}
\def\slothing@sectionskip{8pt}
\def\slothing@accent{0,0,0}
\def\slothing@columns{1}

\define@key{slothing}{font}{\def\slothing@font{#1}}
\define@key{slothing}{fontsize}{\def\slothing@fontsize{#1}}
\define@key{slothing}{margin}{\def\slothing@margin{#1}}
\define@key{slothing}{sectionskip}{\def\slothing@sectionskip{#1}}
\define@key{slothing}{accent}{\def\slothing@accent{#1}}
\define@key{slothing}{columns}{\def\slothing@columns{#1}}

\newcommand{\slothingset}[1]{%
  \setkeys{slothing}{#1}%
  \slothing@apply
}

%% Font families are a closed set so output is reproducible across machines. We do NOT
%% reach for system fonts via fontspec — that would make a user's PDF depend on what is
%% installed where it compiled.
\newcommand{\slothing@apply}{%
  \expandafter\slothing@ifstrequal\expandafter{\slothing@font}{Times}{\RequirePackage{mathptmx}}{}%
  \expandafter\slothing@ifstrequal\expandafter{\slothing@font}{Helvetica}{\RequirePackage{helvet}\renewcommand{\familydefault}{\sfdefault}}{}%
  \expandafter\slothing@ifstrequal\expandafter{\slothing@font}{Palatino}{\RequirePackage{mathpazo}}{}%
  \expandafter\slothing@ifstrequal\expandafter{\slothing@font}{LatinModern}{\RequirePackage{lmodern}}{}%
  \geometry{margin=\slothing@margin}%
  \definecolor{slothingaccent}{RGB}{\slothing@accent}%
}

%% String compare without pulling in etoolbox. Namespaced with @ so it can never collide
%% with etoolbox's \ifstrequal if some future package requires it.
\newcommand{\slothing@ifstrequal}[4]{%
  \edef\slothing@tmpa{#1}\edef\slothing@tmpb{#2}%
  \ifx\slothing@tmpa\slothing@tmpb #3\else #4\fi
}

%% --- section titles ---------------------------------------------------------
\titleformat{\section}
  {\normalfont\large\bfseries\color{slothingaccent}}
  {}{0pt}{}[\vspace{-0.6\baselineskip}\rule{\linewidth}{0.4pt}]

%% --- span anchors (preview only) --------------------------------------------
%% In preview compiles the app appends \slothing@anchorstrue to this file, which makes
%% every id-bearing span emit an invisible link annotation carrying its id. The compile
%% service then extracts those annotations server-side into a JSON hit map, so clicking
%% the rendered PDF resolves to a field.
%%
%% EXPORT compiles never set the flag, so a downloaded resume contains no annotations —
%% the reader would otherwise find every bullet was a dead slothing:// link.
\newif\ifslothing@anchors
\slothing@anchorsfalse

\define@key{slothingspan}{id}{\def\slothing@spanid{#1}}

%% #1 = raw optional-argument body (may be empty), #2 = content to anchor.
\newcommand{\slothing@span}[2]{%
  \def\slothing@spanid{}%
  \ifx\relax#1\relax\else\setkeys{slothingspan}{#1}\fi
  \ifslothing@anchors
    \ifx\slothing@spanid\empty
      #2%
    \else
      \href{slothing://\slothing@spanid}{#2}%
    \fi
  \else
    #2%
  \fi
}

%% --- addressable macros -----------------------------------------------------
%% #1 (optional) is the [id=...] token string, ignored here by design.

\newcommand{\slothingHeader}[3][]{%
  \begin{center}
    \slothing@span{#1}{{\LARGE\bfseries #2}\\[0.35em]{\small #3}}
  \end{center}
  \vspace{0.4em}
}

\newcommand{\slothingSection}[2][]{%
  \vspace{\slothing@sectionskip}%
  \section*{\slothing@span{#1}{#2}}%
}

%% {org}{role}{dates}{body}
\newcommand{\slothingEntry}[5][]{%
  \slothing@span{#1}{\noindent\textbf{#2}\hfill{\small #4}}\\
  \textit{#3}
  \vspace{-0.2em}
  #5
  \vspace{0.35em}
}

\newcommand{\slothingItem}[2][]{\item \slothing@span{#1}{#2}}

\newcommand{\slothingPara}[2][]{\slothing@span{#1}{#2}\par\vspace{0.6em}}

\newcommand{\slothingSkills}[2][]{\noindent \slothing@span{#1}{#2}\par\vspace{0.3em}}

%% --- annotation of imported documents ------------------------------------------
%% \slothingMark renders its content EXACTLY as given and adds nothing visual — it only
%% carries the id so the span becomes addressable.
%%
%% The structural macros above cannot do this job. \slothingItem emits its own \item, so
%% wrapping a bullet that already lives inside someone else's list produces a nested \item
%% and breaks the document. A neutral anchor is the only safe way to annotate a .tex we
%% did not generate.
\newcommand{\slothingMark}[2][]{\slothing@span{#1}{#2}}

%% Entry bodies wrap their items so \slothingItem always has a list to land in.
\newenvironment{slothingItems}
  {\begin{itemize}[leftmargin=1.2em,itemsep=0.1em,topsep=0.2em,parsep=0pt]}
  {\end{itemize}}

%% --- inline subset (§3.4) ---------------------------------------------------
%% The ONLY inline markup the app or the AI may emit. Everything else is escaped text.
\newcommand{\slothingB}[1]{\textbf{#1}}
\newcommand{\slothingI}[1]{\textit{#1}}
\newcommand{\slothingLink}[2]{\href{#1}{#2}}

\endinput
`;

/** Bumped whenever the macros change; participates in the compile cache key. */
export const STY_VERSION = 3;
