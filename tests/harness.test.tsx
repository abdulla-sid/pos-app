import {render, screen} from "@testing-library/react";
import {Button} from "antd";
import {describe, expect, it} from "vitest";


describe("test harness", () => {
    it("renders an AntD Button into jsdom", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", {name: "Click me"})).toBeInTheDocument();
    })
})