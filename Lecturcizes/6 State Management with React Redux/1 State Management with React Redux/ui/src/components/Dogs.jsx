import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { incrementDog } from "../slices/viewCountSlice";

function Dogs() {
  const dispatch = useDispatch();

  useEffect(() => {
    // You can pass parameters directly to your actions.
    dispatch(incrementDog(3));
  }, []);

  return (
    <>
      <h5>Dogs are Great</h5>
      <p>Dogs make great pets.</p>

      <img
        src="https://www.thesprucepets.com/thmb/mjUFLdsMqhggvgc4WNhuzfs3CQ0=/2094x0/filters:no_upscale():strip_icc()/portrait-if-a-spitz-pomeranian_t20_v3o29E-5ae9bbdca18d9e0037d95983.jpg"
        style={{width: "900px"}}
        alt=""
      />
    </>
  );
}

export default Dogs;