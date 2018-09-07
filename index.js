
class MarkdownToc {

    constructor () {
        this.inputArea = document.getElementById("input-area");
        this.outputArea = document.getElementById("output-area");

        this.inputArea.addEventListener("input", this.process.bind(this));
        this.process();
    }

    process() {
        const input = this.inputArea.value;
        const menus = ["# Table of contents", ""];
        let isCodeBlock = false;

        for (let line of input.split("\n")) {

            if (line.startsWith("```")) {
                isCodeBlock = !isCodeBlock;
            }

            if (isCodeBlock) {
                continue;
            }

            if (line.startsWith("#")) {
                const match = line.match(/(#+)\s*(.*)/);
                const level = match[1].length - 1;
                const title = match[2];
                const link = title.toLocaleLowerCase()
                    .replace(/\s/g, "-")
                    .replace(/[^A-Za-z0-9-]/g, "");
                const menu = `${"  ".repeat(level)}- [${title}](#${link})`;
                menus.push(menu);
            }
        }

        this.outputArea.value = menus.join("\n");
    }
}
