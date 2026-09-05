'use client';

import React from 'react';

interface ProjectGraphicSchematicProps {
  slug: string;
  variant?: 'compact' | 'full';
}

export function ProjectGraphicSchematic({ slug, variant = 'full' }: ProjectGraphicSchematicProps) {
  const normalized = slug.toLowerCase();

  if (normalized === 'berryn') {
    return (
      <div className="relative w-full bg-[#04060A] border border-[#162238] rounded-[6px] p-5 font-mono overflow-hidden select-none group">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        
        {/* Top Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#141F33] pb-3 text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-[#93C5FD] font-bold tracking-wider">BERRYN // AST MIGRATION PIPELINE & OPC GRAPH</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#34D399]">VERIFICATION: 4/4 PASS</span>
            <span>OPC INTEGRITY: 100%</span>
          </div>
        </div>

        {/* Pipeline Graphic Diagram */}
        <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Step 1 */}
          <div className="p-3 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2 relative">
            <div className="flex items-center justify-between text-[9px] text-[#60A5FA]">
              <span>[01] INGESTION</span>
              <span>ts-morph</span>
            </div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Legacy AST Scanner</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Extracts <code className="text-[#93C5FD]">xlsx/exceljs</code> import trees and OPC relations without executing code.
            </div>
            <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-[#3B82F6] w-full" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-[9px] text-[#34D399]">
              <span>[02] CODEMOD</span>
              <span>Worktree</span>
            </div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Semantic Transform</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Generates deterministic <code className="text-[#34D399]">.patch</code> files in isolated, disposable Git worktrees.
            </div>
            <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-[#34D399] w-full" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-[9px] text-[#F59E0B]">
              <span>[03] VALIDATION</span>
              <span>4-Stage</span>
            </div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">OPC & XML Matrix</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Asserts structural, semantic XML equality and headless smoke compatibility.
            </div>
            <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-[#F59E0B] w-full" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2">
            <div className="flex items-center justify-between text-[9px] text-[#A855F7]">
              <span>[04] EVIDENCE</span>
              <span>Report V1</span>
            </div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Preservation Guard</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Emits signed JSON evidence and executes <code className="text-[#C084FC]">assertNoSilentLoss()</code>.
            </div>
            <div className="h-1 bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-[#A855F7] w-full" />
            </div>
          </div>
        </div>

        {/* Bottom Interactive Telemetry Bar */}
        <div className="relative z-10 pt-3 border-t border-[#141F33] flex flex-wrap items-center justify-between text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-4">
            <span>PACKAGES: <strong className="text-[#F1F5F9]">15 Monorepo Pkgs</strong></span>
            <span>REGISTRY: <strong className="text-[#F1F5F9]">npm v0.2.0</strong></span>
            <span>TARGET LOSS: <strong className="text-[#34D399]">0.00% (Guaranteed)</strong></span>
          </div>
          <div className="text-[#60A5FA]">OFFLINE CI: --no-network VALIDATED</div>
        </div>
      </div>
    );
  }

  if (normalized === 'aura') {
    return (
      <div className="relative w-full bg-[#04060A] border border-[#162238] rounded-[6px] p-5 font-mono overflow-hidden select-none group">
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#141F33] pb-3 text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[#6EE7B7] font-bold tracking-wider">AURA // 4-TIER HARDWARE MEMORY ORCHESTRATOR</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#60A5FA]">MAX BUDGET: 4.00 GB RSS</span>
            <span className="text-[#34D399]">BENCHMARK: 70/70 PASS</span>
          </div>
        </div>

        {/* 4-Tier Memory Layout Graphic */}
        <div className="relative z-10 py-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Tier 1: GPU */}
            <div className="p-3 bg-[#081216] border border-[#16362C] rounded-[4px] space-y-1">
              <div className="text-[9px] text-[#34D399] font-bold">TIER 01 // GPU VRAM</div>
              <div className="text-[11px] font-bold text-[#F1F5F9]">Active Attention Head</div>
              <div className="text-[10px] text-[#8092A8]">Zero-latency streaming KV-cache & FlashAttention-2</div>
              <div className="text-[10px] text-[#34D399] pt-1">LATENCY: &lt; 1.2ms</div>
            </div>

            {/* Tier 2: Host RAM */}
            <div className="p-3 bg-[#08101E] border border-[#1B2F52] rounded-[4px] space-y-1">
              <div className="text-[9px] text-[#60A5FA] font-bold">TIER 02 // HOST RAM</div>
              <div className="text-[11px] font-bold text-[#F1F5F9]">Quantized Weights</div>
              <div className="text-[10px] text-[#8092A8]">GGUF Q4_K_M locked under Win32 Job / cgroup v2 bounds</div>
              <div className="text-[10px] text-[#60A5FA] pt-1">CEILING: 3.84 GB ACTIVE</div>
            </div>

            {/* Tier 3: NVMe Direct IO */}
            <div className="p-3 bg-[#140F08] border border-[#3E2B12] rounded-[4px] space-y-1">
              <div className="text-[9px] text-[#F59E0B] font-bold">TIER 03 // NVMe STORAGE</div>
              <div className="text-[11px] font-bold text-[#F1F5F9]">Layer Offload Cache</div>
              <div className="text-[10px] text-[#8092A8]">Direct I/O sequential page paging without OS buffer bloat</div>
              <div className="text-[10px] text-[#F59E0B] pt-1">4K RANDOM IOPS: 420K</div>
            </div>

            {/* Tier 4: Compaction */}
            <div className="p-3 bg-[#150A1C] border border-[#391B4C] rounded-[4px] space-y-1">
              <div className="text-[9px] text-[#C084FC] font-bold">TIER 04 // COMPACTION</div>
              <div className="text-[11px] font-bold text-[#F1F5F9]">malloc_trim Engine</div>
              <div className="text-[10px] text-[#8092A8]">Win32 EmptyWorkingSet & glibc active heap reclamation</div>
              <div className="text-[10px] text-[#C084FC] pt-1">RECLAIMED: 100% POST-GEN</div>
            </div>
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 pt-3 border-t border-[#141F33] flex flex-wrap items-center justify-between text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-4">
            <span>CORE: <strong className="text-[#F1F5F9]">Rust 1.80+</strong></span>
            <span>BACKEND: <strong className="text-[#F1F5F9]">llama-server / C++</strong></span>
            <span>OOM CRASH RATE: <strong className="text-[#34D399]">0.00%</strong></span>
          </div>
          <div className="text-[#34D399]">DYNAMIC CONTEXT: 4096 → 1024 AUTO-TUNE</div>
        </div>
      </div>
    );
  }

  if (normalized === 'rivox') {
    return (
      <div className="relative w-full bg-[#04060A] border border-[#162238] rounded-[6px] p-5 font-mono overflow-hidden select-none group">
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#141F33] pb-3 text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[#FCD34D] font-bold tracking-wider">RIVOX // POLYGLOT BUILD DAG & CAS CACHE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#60A5FA]">SECURITY: SLSA LEVEL 2</span>
            <span className="text-[#34D399]">CACHE HIT RATIO: 94.2%</span>
          </div>
        </div>

        {/* DAG Multigraph Graphic */}
        <div className="relative z-10 py-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Ecosystem Multigraph */}
          <div className="p-3.5 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#60A5FA] font-bold uppercase">// 01. MULTIGRAPH SCHEDULER</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Async Wavefront DAG</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Resolves inter-language dependencies across Python (<code className="text-[#60A5FA]">uv</code>), Rust (<code className="text-[#F59E0B]">cargo</code>), Node (<code className="text-[#34D399]">pnpm</code>), Go, & Java (<code className="text-[#C084FC]">gradle</code>).
            </div>
          </div>

          {/* Subtree CAS */}
          <div className="p-3.5 bg-[#081216] border border-[#16362C] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#34D399] font-bold uppercase">// 02. MERKLE SUBTREE CAS</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Content-Addressed Cache</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Zero-copy deterministic cache keys prevent redundant rebuilds across local dev loops and cloud CI runners.
            </div>
          </div>

          {/* SLSA Attestation */}
          <div className="p-3.5 bg-[#140F08] border border-[#3E2B12] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#F59E0B] font-bold uppercase">// 03. SUPPLY-CHAIN PROVENANCE</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">SLSA Level 2 SBOM</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Emits cryptographic build provenance signed with Sigstore and unified deterministic <code className="text-[#FCD34D]">rivox.lock</code>.
            </div>
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 pt-3 border-t border-[#141F33] flex flex-wrap items-center justify-between text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-4">
            <span>CORE: <strong className="text-[#F1F5F9]">100% Rust</strong></span>
            <span>CRATES.IO: <strong className="text-[#F1F5F9]">Published (rivox)</strong></span>
            <span>CONSTITUTION: <strong className="text-[#60A5FA]">"Coordinate. Never Replace."</strong></span>
          </div>
          <div className="text-[#34D399]">5 ECOSYSTEMS SYNCHRONIZED</div>
        </div>
      </div>
    );
  }

  if (normalized === 'vera') {
    return (
      <div className="relative w-full bg-[#04060A] border border-[#162238] rounded-[6px] p-5 font-mono overflow-hidden select-none group">
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-[#141F33] pb-3 text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
            <span className="text-[#FCA5A5] font-bold tracking-wider">VERA // ADVERSARIAL AI VERIFICATION SANDBOX</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#34D399]">INTEGRITY: HMAC-CHAINED</span>
            <span className="text-[#60A5FA]">SANDBOX: VERABOX (RUST)</span>
          </div>
        </div>

        {/* Verification Architecture Graphic */}
        <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-[#14080A] border border-[#3E161C] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#EF4444] font-bold uppercase">// 01. CONTRACT DECLARATION</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Deterministic Boundaries</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Defines immutable <code className="text-[#F87171]">.vera/goal.yaml</code> rules: exit_code assertion passes, file read-only fixture locks, and diff size restraint.
            </div>
          </div>

          <div className="p-3.5 bg-[#080E1A] border border-[#1E2E4A] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#60A5FA] font-bold uppercase">// 02. ISOLATED VERABOX</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">OS Sandbox Isolation</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Enforces OS-level containerization via Linux namespaces/cgroups and Windows Job Objects. Agent cannot alter test harnesses.
            </div>
          </div>

          <div className="p-3.5 bg-[#081216] border border-[#16362C] rounded-[4px] space-y-2">
            <div className="text-[9px] text-[#34D399] font-bold uppercase">// 03. HMAC EVIDENCE CHAIN</div>
            <div className="font-bold text-[#F1F5F9] text-[11px]">Cryptographic Verdict</div>
            <div className="text-[10px] text-[#8092A8] font-sans">
              Append-only tamper-evident SQLite database mathematically verifies execution proof before accepting task completion.
            </div>
          </div>
        </div>

        {/* Bottom Specs */}
        <div className="relative z-10 pt-3 border-t border-[#141F33] flex flex-wrap items-center justify-between text-[10px] text-[#5A6475]">
          <div className="flex items-center gap-4">
            <span>ORCHESTRATOR: <strong className="text-[#F1F5F9]">Go 1.22</strong></span>
            <span>SANDBOX ENGINE: <strong className="text-[#F1F5F9]">Rust (VeraBox)</strong></span>
            <span>FALSE SUCCESS RATE: <strong className="text-[#34D399]">0.00% (Mathematically Blocked)</strong></span>
          </div>
          <div className="text-[#34D399]">EVIDENCE LOGS SIGNED</div>
        </div>
      </div>
    );
  }

  // kuwala
  return (
    <div className="relative w-full bg-[#04060A] border border-[#162238] rounded-[6px] p-5 font-mono overflow-hidden select-none group">
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#141F33] pb-3 text-[10px] text-[#5A6475]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-[#7DD3FC] font-bold tracking-wider">KUWALA // QUANTITATIVE VOLATILITY SURFACE SOLVER</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#34D399]">THROUGHPUT: &gt; 2.6M IV OPS/SEC</span>
          <span className="text-[#60A5FA]">ARBITRAGE: DURRLEMAN CHECKED</span>
        </div>
      </div>

      {/* Quant Analytics Graphic */}
      <div className="relative z-10 py-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-[#08101E] border border-[#1B2F52] rounded-[4px] space-y-2">
          <div className="text-[9px] text-[#38BDF8] font-bold uppercase">// 01. HALLEY-BRENT SOLVER</div>
          <div className="font-bold text-[#F1F5F9] text-[11px]">Compiled Rust Numerical Core</div>
          <div className="text-[10px] text-[#8092A8] font-sans">
            Vectorized IV inversion in <code className="text-[#7DD3FC]">kuwala_core</code> via PyO3 running 2.6M+ ops/sec with zero GIL bottlenecks.
          </div>
        </div>

        <div className="p-3.5 bg-[#081216] border border-[#16362C] rounded-[4px] space-y-2">
          <div className="text-[9px] text-[#34D399] font-bold uppercase">// 02. SSVI ARBITRAGE GUARD</div>
          <div className="font-bold text-[#F1F5F9] text-[11px]">Slice-by-Slice Diagnostics</div>
          <div className="text-[10px] text-[#8092A8] font-sans">
            Calibrates Gatheral SSVI surfaces and guarantees butterfly arbitrage safety (<code className="text-[#34D399]">g(k) ≥ 0</code>) and calendar monotonicity.
          </div>
        </div>

        <div className="p-3.5 bg-[#140F08] border border-[#3E2B12] rounded-[4px] space-y-2">
          <div className="text-[9px] text-[#F59E0B] font-bold uppercase">// 03. COLUMNAR BACKTESTING</div>
          <div className="font-bold text-[#F1F5F9] text-[11px]">DuckDB & Apache Arrow</div>
          <div className="text-[10px] text-[#8092A8] font-sans">
            Zero-copy stream into Purged K-Fold walk-forward validation harnesses with full look-ahead leakage protection.
          </div>
        </div>
      </div>

      {/* Bottom Specs */}
      <div className="relative z-10 pt-3 border-t border-[#141F33] flex flex-wrap items-center justify-between text-[10px] text-[#5A6475]">
        <div className="flex items-center gap-4">
          <span>STACK: <strong className="text-[#F1F5F9]">Python 3.9+ / Rust (PyO3)</strong></span>
          <span>STORAGE: <strong className="text-[#F1F5F9]">Embedded DuckDB</strong></span>
          <span>VALIDATION CASES: <strong className="text-[#34D399]">11,500+ Test Suite Passed</strong></span>
        </div>
        <div className="text-[#38BDF8]">PYPI: PUBLISHED (kuwala)</div>
      </div>
    </div>
  );
}
