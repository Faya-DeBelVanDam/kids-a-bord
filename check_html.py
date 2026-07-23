from html.parser import HTMLParser
import sys

class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        # We only care about block elements that should be closed
        if tag not in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        if tag in ['img', 'br', 'hr', 'input', 'meta', 'link']:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{tag}> at line {self.getpos()[0]}")
            return
        expected, pos = self.stack.pop()
        if expected != tag:
            self.errors.append(f"Mismatched tag: expected </{expected}> (opened at line {pos[0]}), but got </{tag}> at line {self.getpos()[0]}")
            # Put expected back to try to recover
            self.stack.append((expected, pos))

with open('/Users/mac/.gemini/antigravity/scratch/kids-a-bord/index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

parser = HTMLValidator()
parser.feed(html_content)

if parser.errors:
    print("Found HTML errors:")
    for err in parser.errors[:10]:
        print(err)
else:
    print("HTML nesting is perfectly correct!")
    print(f"Remaining open tags in stack: {[t[0] for t in parser.stack]}")
