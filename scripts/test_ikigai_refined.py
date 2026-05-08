"""
Verification script for ikigai-landing-refined/index.html
Tests: render, dark mode toggle + FOUC prevention, scroll animations,
       product card hover, gallery overlay, float labels, form submission.
"""
import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HTML_PATH = Path("C:/Users/Carlos/Documents/Skill Claude Code/ikigai-landing-refined/index.html")
URL = HTML_PATH.as_uri()
PASS = "\033[92m✓\033[0m"
FAIL = "\033[91m✗\033[0m"

results = []

def check(label, condition, detail=""):
    status = PASS if condition else FAIL
    msg = f"  {status} {label}"
    if detail and not condition:
        msg += f"\n      → {detail}"
    print(msg)
    results.append((label, condition))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # ── 1. Basic render ──────────────────────────────────────────────────────
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.goto(URL)
    page.wait_for_load_state("networkidle")

    print("\n【 1 · Basic Render 】")
    check("Navbar present",   page.locator("#navbar").count() > 0)
    check("Hero section",     page.locator("#hero").count() > 0)
    check("Sobre section",    page.locator("#sobre").count() > 0)
    check("Produtos section", page.locator("#produtos").count() > 0)
    check("Diferenciais",     page.locator("#diferenciais").count() > 0)
    check("Galeria section",  page.locator("#galeria").count() > 0)
    check("Depoimentos",      page.locator("#depoimentos").count() > 0)
    check("Contato section",  page.locator("#contato").count() > 0)
    check("Footer present",   page.locator(".footer").count() > 0)

    page.screenshot(path="/tmp/ikigai_01_light.png", full_page=False)
    print("  → screenshot saved: /tmp/ikigai_01_light.png")

    # ── 2. Dark mode toggle ──────────────────────────────────────────────────
    print("\n【 2 · Dark Mode Toggle 】")
    toggle = page.locator("#themeToggle")
    check("Toggle button present", toggle.count() > 0)

    toggle.click()
    page.wait_for_timeout(400)
    theme = page.evaluate("document.documentElement.getAttribute('data-theme')")
    check("data-theme set to 'dark' after click", theme == "dark", f"got: {theme!r}")

    stored = page.evaluate("localStorage.getItem('ikigai-theme')")
    check("localStorage stores 'dark'", stored == "dark", f"got: {stored!r}")

    bg = page.evaluate("getComputedStyle(document.body).backgroundColor")
    check("Body background changed (not white)", bg != "rgb(255, 255, 255)", f"bg: {bg}")

    page.screenshot(path="/tmp/ikigai_02_dark.png", full_page=False)
    print("  → screenshot saved: /tmp/ikigai_02_dark.png")

    # Toggle back to light
    toggle.click()
    page.wait_for_timeout(300)

    # ── 3. FOUC prevention (reload in dark mode) ────────────────────────────
    print("\n【 3 · FOUC Prevention 】")
    # Set dark in localStorage then reload
    page.evaluate("localStorage.setItem('ikigai-theme', 'dark')")
    page.reload()
    page.wait_for_load_state("networkidle")

    theme_after_reload = page.evaluate("document.documentElement.getAttribute('data-theme')")
    check("Dark mode applied immediately on reload (no FOUC)", theme_after_reload == "dark",
          f"data-theme after reload: {theme_after_reload!r}")

    # Reset to light for remaining tests
    page.evaluate("localStorage.removeItem('ikigai-theme')")
    page.reload()
    page.wait_for_load_state("networkidle")

    # ── 4. Scroll animations ─────────────────────────────────────────────────
    print("\n【 4 · Scroll Animations 】")
    # Elements start invisible
    fade_count = page.locator(".fade-up").count()
    check("fade-up elements exist", fade_count > 0, f"count: {fade_count}")

    # Scroll to bottom to trigger all observers
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000)

    visible_count = page.locator(".fade-up.visible").count()
    check("fade-up elements become .visible on scroll",
          visible_count > 0, f"visible: {visible_count}/{fade_count}")

    page.evaluate("window.scrollTo(0, 0)")

    # ── 5. Navbar scroll class ───────────────────────────────────────────────
    print("\n【 5 · Navbar Scroll Class 】")
    page.evaluate("window.scrollTo(0, 100)")
    page.wait_for_timeout(200)
    has_scrolled = page.evaluate("document.getElementById('navbar').classList.contains('scrolled')")
    check("Navbar gains .scrolled class on scroll", has_scrolled)
    page.evaluate("window.scrollTo(0, 0)")

    # ── 6. Product card hover (CSS) ──────────────────────────────────────────
    print("\n【 6 · Product Cards 】")
    cards = page.locator(".produto-card")
    check("3 product cards present", cards.count() == 3, f"count: {cards.count()}")

    first_card = cards.first
    first_card.hover()
    page.wait_for_timeout(300)
    link = first_card.locator(".produto-link")
    check("produto-link exists inside card", link.count() > 0)

    # ── 7. Gallery overlay ───────────────────────────────────────────────────
    print("\n【 7 · Gallery 】")
    gallery_items = page.locator(".galeria-item")
    check("6 gallery items present", gallery_items.count() == 6, f"count: {gallery_items.count()}")
    wide_items = page.locator(".galeria-item--wide")
    check("2 wide gallery items (span 2)", wide_items.count() == 2, f"count: {wide_items.count()}")

    # ── 8. Float labels form ────────────────────────────────────────────────
    print("\n【 8 · Contact Form Float Labels 】")
    nome_input = page.locator("#nome")
    check("Nome input present", nome_input.count() > 0)
    nome_label = page.locator("label[for='nome']")
    check("Nome label present", nome_label.count() > 0)

    nome_input.click()
    page.wait_for_timeout(300)
    # When focused, label should be floated (font-size xs = 0.75rem = 12px)
    label_size = page.evaluate("""
        parseFloat(getComputedStyle(document.querySelector('label[for=nome]')).fontSize)
    """)
    check("Label font-size shrinks on focus (float label)", label_size <= 12.5,
          f"fontSize: {label_size}px")

    # ── 9. Form submission ──────────────────────────────────────────────────
    print("\n【 9 · Form Submission 】")
    page.fill("#nome", "Teste User")
    page.fill("#email", "teste@ikigai.com")
    page.fill("#mensagem", "Mensagem de teste da verificação automatizada.")
    page.wait_for_timeout(200)
    page.locator("#contactForm button[type='submit']").click()
    page.wait_for_timeout(500)

    form_hidden = page.evaluate("getComputedStyle(document.getElementById('contactForm')).display") == "none"
    success_shown = page.locator("#formSuccess.show").count() > 0
    check("Form hides after submit", form_hidden)
    check("Success message appears", success_shown)

    # ── 10. Mobile menu (≤ 1024px) ──────────────────────────────────────────
    print("\n【 10 · Mobile Menu 】")
    mobile = browser.new_page(viewport={"width": 768, "height": 900})
    mobile.goto(URL)
    mobile.wait_for_load_state("networkidle")

    hamburger = mobile.locator("#hamburger")
    check("Hamburger visible on mobile", hamburger.is_visible())

    hamburger.click()
    mobile.wait_for_timeout(400)
    nav_open = mobile.locator("#navLinks.mobile-open").count() > 0
    overlay_open = mobile.locator("#navOverlay.open").count() > 0
    check("Drawer opens (mobile-open class)", nav_open)
    check("Overlay visible", overlay_open)

    mobile.locator("#navOverlay").click()
    mobile.wait_for_timeout(400)
    nav_closed = mobile.locator("#navLinks.mobile-open").count() == 0
    check("Drawer closes on overlay click", nav_closed)

    mobile.screenshot(path="/tmp/ikigai_10_mobile.png", full_page=False)
    print("  → screenshot saved: /tmp/ikigai_10_mobile.png")
    mobile.close()

    # ── 11. Footer always dark ───────────────────────────────────────────────
    print("\n【 11 · Footer Always Dark 】")
    page.reload()
    page.wait_for_load_state("networkidle")
    footer_bg = page.evaluate("getComputedStyle(document.querySelector('.footer')).backgroundColor")
    check("Footer background is dark (#0D1117 = rgb(13,17,23))", "13, 17, 23" in footer_bg,
          f"bg: {footer_bg}")

    browser.close()

# ── Summary ──────────────────────────────────────────────────────────────────
print("\n" + "─" * 50)
passed = sum(1 for _, ok in results if ok)
total  = len(results)
print(f"  Result: {passed}/{total} checks passed")
if passed == total:
    print("  \033[92mAll checks passed ✓\033[0m")
else:
    failed = [label for label, ok in results if not ok]
    print(f"  \033[91mFailed:\033[0m {', '.join(failed)}")
print("─" * 50)
sys.exit(0 if passed == total else 1)
