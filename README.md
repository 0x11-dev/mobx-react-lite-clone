# mobx-react-lite

一个简单的 mobx-react-lite 实现，可以看 mobx 作者的[分享](https://www.youtube.com/watch?v=cPF4iBedoF0&feature=youtu.be&t=1307)，核心代码：

```js
function observer(component) {
  return (props) => {
    console.log("tt");
    let [tick, updateTick] = useState(0);
    let r = useMemo(
      () =>
        new Reaction(null, () => {
          updateTick(tick + 1);
        }),
      [tick]
    );

    useEffect(() => () => {
      console.log("disposed");
      r.dispose();
      return () => {
        console.log("unmount");
      };
    });

    let render;
    r.track(() => {
      render = component({ ...props, tick });
    });
    return render;
  };
}
```
